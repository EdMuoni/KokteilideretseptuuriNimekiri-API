const jwt = require('jsonwebtoken');
//REGISTER NEW USER
exports.register = async (req, res) => {
    try {
        const{
            FullName,
            EmailAddress,
            PasswordHASH,
            UserName,
            PhoneNumber2FA
        } = req.body;
    // Validates required fields
        if (
            !FullName || 
            !EmailAddress || 
            !Password || 
            !UserName) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
        }
            // Checks if email already exists
            const emailExists = await db.users.findOne({
            where: { EmailAddress }
            });

            if (emailExists) {
            return res.status(409).json({
                error: 'Email already in use'
            });
            }

            // Checks if username already exists
            const usernameExists = await db.users.findOne({
            where: { UserName }
            });

            if (usernameExists) {
            return res.status(409).json({
                error: 'Username already in use'
            });
            }

            // Hash password
            const hashedPassword = await Utilities.gimmePassword(Password);

            // Creating user object
            const newUser = {
            UserID: UUID.v7(),
            FullName,
            EmailAddress,
            PasswordHASH: hashedPassword,
            UserName,
            IsAdmin: false
            };

            if (PhoneNumber2FA) {
            newUser.PhoneNumber2FA = PhoneNumber2FA;
            }

            // Saving user to database
            const createdUser = await db.users.create(newUser);

            // Creating JWT token
            const token = jwt.sign(
            {
                UserID: createdUser.UserID,
                IsAdmin: createdUser.IsAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );

            // Returning response for frontend
            return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                UserID: createdUser.UserID,
                FullName: createdUser.FullName,
                EmailAddress: createdUser.EmailAddress,
                UserName: createdUser.UserName,
                IsAdmin: createdUser.IsAdmin
            }
            });

        }
        catch  (error) {
            console.error('Register error:', error);
            return res.status(500).json({
            error: 'Registration failed'
            });
    }
};

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DBNAME,
    process.env.DB_USERNAME,
    process.env.DB_USERPASS,
    {
        host: process.env.DB_HOSTNAME,
        dialect: 'mariadb',

        logging: false,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Load models
db.recipes = require('./models/Recipe.js')(sequelize, DataTypes);
db.users = require('./models/User.js')(sequelize, DataTypes);
db.userRatings = require('./models/UserRating.js')(sequelize, DataTypes);

// Define correct associations WITH PROPER FOREIGN KEYS
// UserRating belongs to User
db.userRatings.belongsTo(db.users, {
    foreignKey: 'UserID',  
    as: 'user'
});

// UserRating belongs to Recipe
db.userRatings.belongsTo(db.recipes, {
    foreignKey: 'RecipeID',  
    as: 'recipe'
});

// User has many UserRatings
db.users.hasMany(db.userRatings, {
    foreignKey: 'UserID',  
    as: 'ratings'
});

// Recipe has many UserRatings
db.recipes.hasMany(db.userRatings, {
    foreignKey: 'RecipeID', 
    as: 'ratings'
});

const sync = async () => {
    try {
        await sequelize.sync({force: false});
        console.log('DB sync completed.');
    } catch (error) {
        console.error('Sync error:', error);
    }
};

module.exports = {db, sync};
