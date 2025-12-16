//const {Datatypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Cocktail = sequelize.define(
        'Cocktail', {
        RecipeID: {
            type: DataTypes.UUID, // Unique identifier (UUID v4)
            defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
            primaryKey: true, //autoIncrement: true
        },
        Name : {
            type: DataTypes.STRING,
            allowNull: false
        },
        Description : {
            type: DataTypes.STRING,
            allowNull: false
        },

        Beverage : {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        UserScore : {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        
    
    })

    console.log(Cocktail === sequelize.models.Cocktail)
    return Cocktail;
}