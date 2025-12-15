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
frontend-setup

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
    foreignKey: 'UserID',  // ← THIS TELLS SEQUELIZE TO USE UserID, NOT UserUserID
    as: 'user'
});

// UserRating belongs to Recipe
db.userRatings.belongsTo(db.recipes, {
    foreignKey: 'RecipeID',  // ← THIS TELLS SEQUELIZE TO USE RecipeID, NOT CocktailRecipeID
    as: 'recipe'
});

// User has many UserRatings
db.users.hasMany(db.userRatings, {
    foreignKey: 'UserID',  // ← MUST MATCH THE COLUMN NAME IN YOUR DATABASE
    as: 'ratings'
});

// Recipe has many UserRatings
db.recipes.hasMany(db.userRatings, {
    foreignKey: 'RecipeID',  // ← MUST MATCH THE COLUMN NAME IN YOUR DATABASE
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

// UserRating is a junction table for many-to-many relationship between Users and Recipes
// db.recipes.belongsToMany(db.users, {through: db.userRatings, as: 'recipes'});
// db.users.belongsToMany(db.recipes, {through: db.userRatings});

// Also add direct relationships for easier querying
// db.userRatings.belongsTo(db.users, {foreignKey: 'UserID'});
// db.userRatings.belongsTo(db.recipes, {foreignKey: 'RecipeID'});
// db.users.hasMany(db.userRatings, {foreignKey: 'UserID'});
// db.recipes.hasMany(db.userRatings, {foreignKey: 'RecipeID'});
frontend-setup
