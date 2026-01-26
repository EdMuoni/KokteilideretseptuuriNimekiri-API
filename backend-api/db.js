const {Sequelize, DataTypes} = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = new Sequelize(
    process.env.DB_DBNAME,
    process.env.DB_USERNAME,
    process.env.DB_USERPASS,
    {
        host: process.env.DB_HOSTNAME,
        dialect: 'mariadb',
        logging: console.log,
    }
);

async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully, yippie!');
    } catch (error) {
        console.error("Unable to connect. " + error);
    }
}

const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'Sessions',
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// Load models
db.recipes = require('./models/Recipe.js')(sequelize, DataTypes);
db.users = require('./models/User.js')(sequelize, DataTypes);
db.userRatings = require('./models/UserRating.js')(sequelize, DataTypes);
//db.sessions = require('./models/Session.js')(sequelize, DataTypes);

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

const sync = (async () => {
    await sessionStore.sync();
    await sequelize.sync({alter: true});
    console.log('DB sync has been completed.');
});

module.exports = {db, sync, sessionStore};
