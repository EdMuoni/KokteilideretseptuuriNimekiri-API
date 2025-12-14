const {db} = require ('../db');
const Utilities = require('./Utilities');
const UUID = require('uuid');

exports.create = async (req, res) => {
    if (req.body.UserScore || !req.body.UserComment) {
        return res.status(400).send({error: "Missing some parameter, please review your request data."});
    }

    if (!req.body.UserID || !req.body.RecipeID) {
        return res.status(404).send({error: "USER or RECIPE not found"});
    }
    let newRating = {
        UserScore: req.body.UserScore,
        UserComment: req.body.UserComment,
        UserID: req.body.UserID,
        RecipeID: req.body.RecipeID
    }
    db.users.belongsToMany(db.recipes, {through: db.ratings});
    db.recipes.belongsToMany(db.users, {through: db.ratings});

    const submittedRating = await db.ratings.create(newRating);
    res
    .location(`${Utilities.getBaseURL(req)}/ratings/${createdRating.RatingID}`)
    .sendStatus(201);
}