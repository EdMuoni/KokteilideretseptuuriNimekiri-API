const CotailRecipesController = require('../controllers/CoctailRecipesController');

module.exports = (app) => {
    app.get('/recipes')
    .get(CotailRecipesController.getAll);   
}