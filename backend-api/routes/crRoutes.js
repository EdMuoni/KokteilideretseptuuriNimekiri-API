const CocktailRecipesController = require("../controllers/CocktailRecipesController")
const UsersController = require("../controllers/UsersController")
const UserRatingsController = require("../controllers/UserRatingsController")

module.exports = (app) => {
    app.route("/recipes")
    .get(CocktailRecipesController.getAll)
    .post(CocktailRecipesController.create)
    app.route("/recipes/:RecipeID")
    .get(CocktailRecipesController.getByID)
    .delete(CocktailRecipesController.deletedById)
    .put(CocktailRecipesController.modifiedById)
    app.route("/users")
    .post(UsersController.create)
    app.route("/UserRatings")
    .post(UserRatingsController.create)
}