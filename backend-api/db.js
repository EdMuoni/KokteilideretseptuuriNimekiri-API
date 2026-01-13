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
