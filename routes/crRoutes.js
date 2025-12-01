const CocktailRecipesController = require("../controllers/CocktailRecipesController")

module.exports = (app) => {
    app.route("/recipes")
    .get(CocktailRecipesController.getAll)
}