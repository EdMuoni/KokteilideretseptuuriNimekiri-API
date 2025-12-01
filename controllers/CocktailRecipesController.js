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

exports.getByID =
async (req, res) => {
    const film = await getRecipe(req, res);
    if (!Recipe) {return res.status(404).send("Recipe not found")};
    res
    .status(200)
    .send(Recipe);
}

const getRecipe =
async (req, res) => {
    const idNumber = req.params.RecipeID;
    if(isNaN(idNumber)) {
        res.status(400).send({error: `Entered ID is not valid ${idNumber}`});
        return null;
    }
    const film = await db.recipes.findByPk(idNumber);
    if(!film) {
        res.status(400).send({Error: `Entered ID is not valid ${idNumber}`});
        return null;
    }
    return recipe;
}