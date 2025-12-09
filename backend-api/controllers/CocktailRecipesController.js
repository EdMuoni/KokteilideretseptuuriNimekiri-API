const {db} = require('../db');
const Utilities = require('./Utilities.js');
//const UUID = require('uuid');

exports.getAll = 
async (req, res) => {
    const recipes = await db.recipes.findAll();
    console.log("getAll: " + recipes)
    res
    .status(200)
    .send(recipes.map(({RecipeID, Name}) => {return{RecipeID, Name}}))
}

exports.getByID =
async (req, res) => {
    const recipe = await getRecipe(req, res);
    if (!recipe) {return res.status(404).send("Recipe not found")};
    res
    .status(200)
    .send(recipe);
}

exports.create = 
async (req, res) => {
    if(
        !req.body.Name ||
        !req.body.Description ||
        !req.body.Beverage ||
        !req.body.UserScore
    ) {
        return res.status(400).send({error: "Missing some parameter, please review your request data."});
    }
        const newRecipe = {
        Name: req.body.Name,
        Description: req.body.Description,
        Beverage: req.body.Beverage,
        UserScore: req.body.UserScore
    }
        const createdRecipe = await db.recipes.create(newRecipe);
        return res
        .location(`${Utilities.getBaseURL(req)}/recipes/${createdRecipe.RecipeID}`)
        .sendStatus(201);  
}
exports.deletedById =
async (req, res) => {
    const recipeToBeDeleted = await getRecipe(req, res);
    if(!recipeToBeDeleted) 
    {
        return;
    }
    await recipeToBeDeleted.destroy();
    res.status(204).send({error: "No Content"});
}	

exports.deletedById =
async (req, res) => {
    const recipeToBeDeleted = await getRecipe(req, res);
    if(!recipeToBeDeleted) 
    {
        return;
    }
    await recipeToBeDeleted.destroy();
    re.status(204).send({error:"No Content"});
}

const getRecipe =
async (req, res) => {
    const idNumber = req.params.RecipeID;
    // if(isNaN(idNumber)) {
    //     res.status(400).send({error: `Entered ID is not valid ${idNumber}`});
    //     return null;
    // }
    const recipe = await db.recipes.findByPk(idNumber);
    if(!recipe) {
        res.status(400).send({Error: `Entered ID is not valid ${idNumber}`});
        return null;
    }
    return recipe;
}
