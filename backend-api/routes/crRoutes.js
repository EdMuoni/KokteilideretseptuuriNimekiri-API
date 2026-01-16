const CocktailRecipesController = require("../controllers/CocktailRecipesController")
const UsersController = require("../controllers/UsersController")
const UserRatingsController = require("../controllers/UserRatingsController")
const SessionController = require("../controllers/SessionController")
console.log('REGISTER TYPE:', typeof UsersController.register);

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
    .get(UsersController.getAllUsers)

    app.route("/auth/register")
    .post(UsersController.register)
    //app.post("/auth/login",UsersController.login)

    app.route("/auth/:LoginEmail")
    //.get(UsersController.getByEmail)
    app.route("/sessions")
    .post(SessionController.newSession)
    app.route("/sessions/me")
    .get(SessionController.reAuthenticate)
    app.route("/auth/logout")
    .delete(SessionController.removeSession)

    app.route("/UserRatings")
    .post(UserRatingsController.create)
    .get(UserRatingsController.getAll)
    
    app.route("/UserRatings/:UserRatingID")
    .get(UserRatingsController.getById)
    .put(UserRatingsController.update)
    .delete(UserRatingsController.delete)
}

