const {db} = require('../db');
const Utilities = require('./Utilities');
const UUID = require('uuid');

// CREATE - Add a new rating
exports.create = async (req, res) => {
    // Validation - FIXED: Added missing ! operator
    if (!req.body.UserScore || !req.body.UserComment) {
        return res.status(400).send({
            error: "Missing some parameter, please review your request data."
        });
    }

    if (!req.body.UserID || !req.body.RecipeID) {
        return res.status(404).send({
            error: "USER or RECIPE not found"
        });
    }

    try {
        let newRating = {
            UserRatingID: UUID.v4(), // FIXED: Added missing ID
            UserScore: req.body.UserScore,
            UserComment: req.body.UserComment,
            UserID: req.body.UserID,
            RecipeID: req.body.RecipeID
        };

        // FIXED: Changed db.ratings to db.userRatings
        const submittedRating = await db.userRatings.create(newRating);
        
        return res
            .location(`${Utilities.getBaseURL(req)}/userRatings/${submittedRating.UserRatingID}`)
            .sendStatus(201);
    } catch (error) {
        console.error('Error creating rating:', error);
        return res.status(500).send({
            error: 'Failed to create rating',
            details: error.message
        });
    }
};

// READ ALL - Get all ratings
exports.getAll = async (req, res) => {
    try {
        const ratings = await db.userRatings.findAll({
            include: [
                {model: db.users, as: 'user', attributes: ['UserName', 'FullName']},
                {model: db.recipes, as: 'recipe', attributes: ['Name', 'Description']}
            ]
        });
        return res.status(200).json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return res.status(500).send({
            error: 'Failed to fetch ratings',
            details: error.message
        });
    }
};

// READ ONE - Get rating by ID
exports.getById = async (req, res) => {
    try {
        const rating = await db.userRatings.findByPk(req.params.UserRatingID, {
            include: [
                {model: db.users, as: 'user'},
                {model: db.recipes, as: 'recipe'}
            ]
        });
        
        if (!rating) {
            return res.status(404).send({error: "Rating not found"});
        }
        
        return res.status(200).json(rating);
    } catch (error) {
        console.error('Error fetching rating:', error);
        return res.status(500).send({
            error: 'Failed to fetch rating',
            details: error.message
        });
    }
};

// UPDATE - Modify a rating
exports.update = async (req, res) => {
    try {
        const rating = await db.userRatings.findByPk(req.params.UserRatingID);
        
        if (!rating) {
            return res.status(404).send({error: "Rating not found"});
        }

        // Update fields if provided
        if (req.body.UserScore !== undefined) rating.UserScore = req.body.UserScore;
        if (req.body.UserComment !== undefined) rating.UserComment = req.body.UserComment;
        
        await rating.save();
        
        return res.status(200).json(rating);
    } catch (error) {
        console.error('Error updating rating:', error);
        return res.status(500).send({
            error: 'Failed to update rating',
            details: error.message
        });
    }
};

// DELETE - Remove a rating
exports.delete = async (req, res) => {
    try {
        const rating = await db.userRatings.findByPk(req.params.UserRatingID);
        
        if (!rating) {
            return res.status(404).send({error: "Rating not found"});
        }
        
        await rating.destroy();
        
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting rating:', error);
        return res.status(500).send({
            error: 'Failed to delete rating',
            details: error.message
        });
    }
};