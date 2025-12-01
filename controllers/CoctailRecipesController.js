const {Datatypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Cocktail = this.sequelize.define(
        'Cocktail', {
        RecipeID: {
            type: Datatypes.UUID,
            primaryKey: true,
            autoIncrement: true
        },
        Name : {
            type: Datatypes.STRING,
            allowNull: false
        },
        Description : {
            type: Datatypes.STRING,
            allowNull: false
        },

        Beverage : {
            type: Datatypes.STRING,
            allowNull: false
        },
        
        UserScore : {
            type: Datatypes.DECIMAL,
            allowNull: false
        },
        
    
    })

    console.log(Cocktail === this.sequelize.models.Cocktail)
    return Cocktail;
}