//const {Datatypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Cocktail = sequelize.define(
        'Cocktail', {
        RecipeID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            //autoIncrement: true
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