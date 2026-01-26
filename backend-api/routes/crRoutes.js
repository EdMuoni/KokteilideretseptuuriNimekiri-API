const CocktailRecipesController = require("../controllers/CocktailRecipesController")
const UsersController = require("../controllers/UsersController")
const UserRatingsController = require("../controllers/UserRatingsController")
const SessionController = require("../controllers/SessionController")
console.log('REGISTER TYPE:', typeof UsersController.register);

module.exports = (app) => {

    // COCKTAIL RECIPES ROUTES
    app.route("/recipes")
        .get(CocktailRecipesController.getAll)
        .post(CocktailRecipesController.create)

    app.route("/recipes/:RecipeID")
        .get(CocktailRecipesController.getByID)
        .delete(CocktailRecipesController.deletedById)
        .put(CocktailRecipesController.modifiedById)

    // USERS ROUTES
    // Get all users OR filter by email (?email=a@a.com)
    app.route("/users")
        .post(UsersController.create)
        .get(UsersController.getAllUsers)
    
    // Get user by UserID
    app.route("/users/:UserID")
        .get(UsersController.getByID)

    // AUTHENTICATION ROUTES
    // Register new user
    app.route("/auth/register")
        .post(UsersController.register)
    
    // Login with email and password
    app.route("/auth/login")
        .post(SessionController.newSession)
    
    // Get user by email
    app.route("/auth/:LoginEmail")
        .get(UsersController.getUserByEmail)

    // SESSION ROUTES
    // Create new session (login)
    app.route("/session")
        .post(SessionController.newSession)
    
    // Check current session (re-authenticate)
    app.route("/sessions/me")
        .get(SessionController.reAuthenticate)
    
    // Logout (destroy session)
    // app.route("/auth/logout")
    //     .delete(SessionController.removeSession)

    // USER RATINGS
    app.route("/UserRatings")
        .post(UserRatingsController.create)
        .get(UserRatingsController.getAll)

    app.route("/UserRatings/:UserRatingID")
        .get(UserRatingsController.getById)
        .put(UserRatingsController.update)
        .delete(UserRatingsController.delete)
}