const {db} = require("../db.js")
const Utilities = require("./Utilities.js")

    // Create a new session (login)
    // Validates credentials and creates a session for the user
exports.newSession = async (req, res) => {
    console.log('[Login] Request body:', req.body)
    
    // Validates input parameters
    if (!req.body.LoginEmail || !req.body.LoginPassword) {
        var missingparams = "";
        if (!req.body.LoginEmail) {
            missingparams += " No email provided. ";
        }
        if (!req.body.LoginPassword) {
            missingparams += "No password provided. ";
        }
        return res.status(400).send({error: "Missing parameter for logging in" + missingparams})
    }

    LoginEmail = req.body.LoginEmail
    console.log('[Login] Attempting login for:', LoginEmail)

    // Find user by email
    var userToProvideSessionFor = await db.users.findOne({where: {EmailAddress: LoginEmail}})
    if (!userToProvideSessionFor) {
        console.log('[Login] User not found:', LoginEmail)
        return res.status(404).send({error: "User not found"})
    }

    // Verify password
    var isCorrect = (await Utilities.letMeIn(req.body.LoginPassword, userToProvideSessionFor.PasswordHASH))
    if (!isCorrect) {
        console.log('[Login] Password mismatch for:', LoginEmail)
        return res.status(401).send({error: "Password mismatch"})
    }

    // Create session
    req.session.UserID = userToProvideSessionFor.UserID
    console.log('[Login] Session created for UserID:', userToProvideSessionFor.UserID)

    // Return user data - FIXED: Using UserName instead of DisplayName
    return res.status(200).send({
        UserID: userToProvideSessionFor.UserID,
        UserName: userToProvideSessionFor.UserName,
        EmailAddress: userToProvideSessionFor.EmailAddress,
        IsAdmin: userToProvideSessionFor.IsAdmin
    })
}

    // Re-authenticate existing session
    //Checks if user has a valid session and returns their data

exports.reAuthenticate = async (req, res) => {
    console.log('[ReAuth] Checking session...')
    console.log('[ReAuth] Session object:', req.session)
    console.log('[ReAuth] Session UserID:', req.session ? req.session.UserID : 'No session')
    
    // Check if session exists
    if (!req.session.UserID) {
        console.log('[ReAuth] No UserID in session')
        return res.status(401).send({error: "Session expired, please log in again."})
    }
    
    // Find user by session UserID
    var user = await db.users.findByPk(req.session.UserID)
    if (!user) {
        console.log('[ReAuth] User not found in database:', req.session.UserID)
        return res.status(401).send({error: "Logged in user not found, please log in again."})
    }
    
    console.log('[ReAuth] User authenticated:', user.UserName)
    
    // Return user data - FIXED: Using UserName instead of DisplayName
    return res.status(200).send({
        UserID: user.UserID,
        UserName: user.UserName,
        EmailAddress: user.EmailAddress,
        IsAdmin: user.IsAdmin
    })
}

    //Remove session (logout)
    //Destroys the user's session and clears cookies
exports.removeSession = async (req, res) => {
    console.log('[Logout] Destroying session...')
    
    if (!req.session || req.session === undefined) {
        return res.status(401).send({error: "User is not logged in"})
    }

    req.session.destroy(err => {
        if (err) {
            console.error('[Logout] Error destroying session:', err)
            return res.status(500).send({error: "Server error, please hold."})
        }
    })

    res.clearCookie("connect.sid")
    console.log('[Logout] Session destroyed successfully')
    res.status(200).send({ok: "Session successfully eliminated."})
}
