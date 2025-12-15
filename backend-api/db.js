const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DBNAME,
    process.env.DB_USERNAME,
    process.env.DB_USERPASS,
    {
        host: process.env.DB_HOSTNAME,
        dialect: 'mariadb',
        logging: false, // Changed to false to reduce console noise
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

// UserRating is a junction table for many-to-many relationship between Users and Recipes
// db.recipes.belongsToMany(db.users, {through: db.userRatings, as: 'recipes'});
// db.users.belongsToMany(db.recipes, {through: db.userRatings});

// Also add direct relationships for easier querying
// db.userRatings.belongsTo(db.users, {foreignKey: 'UserID'});
// db.userRatings.belongsTo(db.recipes, {foreignKey: 'RecipeID'});
// db.users.hasMany(db.userRatings, {foreignKey: 'UserID'});
// db.recipes.hasMany(db.userRatings, {foreignKey: 'RecipeID'});

// Define correct associations
// UserRating belongs to User (a rating is made BY a user)
db.userRatings.belongsTo(db.users, {
    foreignKey: 'UserID',
    as: 'user'
});

// UserRating belongs to Recipe (a rating is made FOR a recipe)
db.userRatings.belongsTo(db.recipes, {
    foreignKey: 'RecipeID',
    as: 'recipe'
});

// User has many UserRatings (a user can make many ratings)
db.users.hasMany(db.userRatings, {
    foreignKey: 'UserID',
    as: 'ratings'
});

// Recipe has many UserRatings (a recipe can have many ratings)
db.recipes.hasMany(db.userRatings, {
    foreignKey: 'RecipeID',
    as: 'ratings'
});

const sync = async () => {
    try {
        // Changed to force: false to avoid data loss
        await sequelize.sync({force: false});
        console.log('DB sync completed.');
    } catch (error) {
        console.error('Sync error:', error);
    }
};

module.exports = {db, sync};
