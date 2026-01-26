const {db} = require('../db')
const Utilities = require('./Utilities')
const UUID = require('uuid')
const jwt = require('jsonwebtoken');

// REGISTER NEW USER
exports.register = async (req, res) => {
    try {
        const{
            FullName,
            EmailAddress,
            PasswordHASH,
            UserName,
            PhoneNumber2FA
        } = req.body;
    // Validates required fields
        if (
            !FullName || 
            !EmailAddress || 
            !PasswordHASH || 
            !UserName) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
        }
            // Checks if email already exists
            const emailExists = await db.users.findOne({
            where: { EmailAddress }
            });

            if (emailExists) {
            return res.status(409).json({
                error: 'Email already in use'
            });
            }

            // Checks if username already exists
            const usernameExists = await db.users.findOne({
            where: { UserName }
            });

            if (usernameExists) {
            return res.status(409).json({
                error: 'Username already in use'
            });
            }

            // Hash password
            const hashedPassword = await Utilities.gimmePassword(PasswordHASH);

            // Creating user object
            const newUser = {
            UserID: UUID.v7(),
            FullName,
            EmailAddress,
            PasswordHASH: hashedPassword,
            UserName,
            IsAdmin: false
            };

            if (PhoneNumber2FA) {
            newUser.PhoneNumber2FA = PhoneNumber2FA;
            }

            // Saving user to database
            const createdUser = await db.users.create(newUser);

            // Creating JWT token
            const token = jwt.sign(
            {
                UserID: createdUser.UserID,
                IsAdmin: createdUser.IsAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );

            // Returning response for frontend
            return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                UserID: createdUser.UserID,
                FullName: createdUser.FullName,
                EmailAddress: createdUser.EmailAddress,
                UserName: createdUser.UserName,
                IsAdmin: createdUser.IsAdmin
            }
            });

        }
        catch  (error) {
            console.error('Register error:', error);
            console.error('Stack trace:', error.stack);
            return res.status(500).json({
            error: 'Registration failed',
            details: error.message
            });
    }
};

exports.create =
async (req,res) => {
    if (
        !req.body.FullName ||
        !req.body.EmailAddress ||
        !req.body.PasswordHASH ||
        !req.body.UserName 
    ){
        return res.status(400).json({error: 'Missing required fields'});
    }
    const newUser = {
        UserID: UUID.v7(),
        FullName: req.body.FullName,
        EmailAddress: req.body.EmailAddress,
        PasswordHASH: (await Utilities.gimmePassword(req.body.PasswordHASH)).toString(),
        UserName: req.body.UserName
    }
    
        if(req.body.PhoneNumber2FA != null){
        newUser.PhoneNumber2FA = Utilities.gimmePassword(req.body.PhoneNumber2FA).toString();}
    
    const resultingUser = await db.users.create(newUser);
    return res
    .location(`${Utilities.getBaseURL(req)}/users/${resultingUser.UserID}`).sendStatus(201);
}

// GET ALL USERS (with optional email filter)
exports.getAllUsers = async (req, res) => {
  try {
    // Check for email filter in query parameter OR header
    const emailFilter = req.query.email || req.headers['loginemail'];
    
    // Build where clause - EMPTY {} means get ALL users
    let whereClause = {};
    if (emailFilter) {
      whereClause.EmailAddress = emailFilter;
    }

    // Fetch users with optional filter
    const users = await db.users.findAll({
      where: whereClause,
      attributes: ['UserID', 'FullName', 'UserName', 'IsAdmin', 'EmailAddress']
    });

    // If email was provided but no users found
    if (emailFilter && users.length === 0) {
      return res.status(404).json({ 
        error: 'User not found',
        email: emailFilter 
      });
    }

    // Map users to return only specific fields
    const userList = users.map(({ UserID, FullName, UserName, IsAdmin }) => {
      return { UserID, FullName, UserName, IsAdmin };
    });

    return res.status(200).json(userList);
  } catch (error) {  
    console.error("Error fetching users:", error);
    return res.status(500).send({ 
      error: "Failed to fetch users",
      details: error.message 
    });
  }
};

// GET USER BY ID
exports.getByID = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) return; // Error already sent by getUser
    
    return res.status(200).json({
      UserID: user.UserID,
      FullName: user.FullName,
      UserName: user.UserName,
      EmailAddress: user.EmailAddress,
      IsAdmin: user.IsAdmin
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return res.status(500).json({
      error: 'Failed to fetch user',
      details: error.message
    });
  }
};

const getUser = async (req, res) => {
    const userID = req.params.UserID;
    const user = await db.users.findByPk(userID);
    if (!user) {
        res.status(404).json({error: `User with this ID does not exist ${userID}.`});
        return null;
    }
    return user;
}

// GET USER BY EMAIL
exports.getUserByEmail = async (req, res) => {
  try {
    const loginEmail = req.params.LoginEmail;
    
    const user = await db.users.findOne({
      where: { EmailAddress: loginEmail },
      attributes: ['UserID', 'FullName', 'UserName', 'IsAdmin', 'EmailAddress']
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch user',
      details: error.message 
    });
  }
};