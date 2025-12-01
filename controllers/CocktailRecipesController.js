const {db} = require('../db');
const Utilities = require('./Utilities.js');
  

exports.getAll = 
async (req, res) => {
    const recipes = await db.Recipe.findAll();
    console.log("getAll: " + recipes)
    res
    .status(200)
    .send(recipes.map(({RecipeID, Name}) => {return{RecipeID, Name}}))
}