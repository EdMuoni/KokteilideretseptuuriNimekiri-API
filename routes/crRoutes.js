const CocktailRecipesController = require("../controllers/CocktailRecipesController")

module.exports = (app) => {
    app.route("/recipes")
    .get(CocktailRecipesController.getAll)
    app.route("/recipes/:RecipeID")
    .get(CocktailRecipesController.getByID)
}