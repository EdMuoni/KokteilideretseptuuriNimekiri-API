const CocktailRecipesController = require("../controllers/CocktailRecipesController")

module.exports = (app) => {
    app.route("/recipes")
    .get(CocktailRecipesController.getAll)
    .post(CocktailRecipesController.create)
    app.route("/recipes/:RecipeID")
    .get(CocktailRecipesController.getByID)
    .delete(CocktailRecipesController.deletedById)
}