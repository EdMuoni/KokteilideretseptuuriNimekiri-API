const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DBNAME,
    process.env.DB_USERNAME,
    process.env.DB_USERPASS,
    {
        host: process.env.DB_HOSTNAME,
        dialect: 'mariadb',
        logging: console.log, //sellekes, et saaks näha SQL päringuid konsoolis
    }
)

async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully, yippie!');
    } catch (error) {
        console.error('Unable to connect to the database:' + error);
    }
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.recipes = require('./models/Recipe.js')(sequelize, DataTypes);

const sync = (async () => {
    await sequelize.sync({alter: true});
    console.log('DB sync has been completed.');
})

module.exports = {db, sync};