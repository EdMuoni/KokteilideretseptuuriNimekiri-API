const {db} = require('../db')
const Utilities = require('./Utilities')
const UUID = require('uuid')
const jwt = require('jsonwebtoken');

// REGISTER NEW USER (auth)
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
            return res.status(500).json({
            error: 'Registration failed'
            });
    }
};

//  Logging in user (auth)

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const user = await db.users.findOne({
            where: { EmailAddress: email }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const isPasswordValid = await Utilities.letMeIn(password, user.PasswordHASH);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                UserID: user.UserID,
                IsAdmin: user.IsAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                UserID: user.UserID,
                FullName: user.FullName,
                EmailAddress: user.EmailAddress,
                UserName: user.UserName,
                IsAdmin: user.IsAdmin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            error: 'Login failed'
        });
    }
};

// CREATE - Add a new user
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
        newUser.PhoneNumber2FA = (await Utilities.gimmePassword(req.body.PhoneNumber2FA)).toString();}
    
    const resultingUser = await db.users.create(newUser);
    return res
    .location(`${Utilities.getBaseURL(req)}/users/${resultingUser.UserID}`).sendStatus(201);
}

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    // Fetches all users from database
    const users = await db.users.findAll();

    // If no users found, return empty array
    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    // Map users to return only specific fields
    const userList = users.map(({ UserID, FullName, UserName, IsAdmin }) => {
      return { UserID, FullName, UserName, IsAdmin };
    });

    // Return success with user list
    return res.status(200).json(userList);
    } catch (error) {  
    console.error("Error fetching users:", error);

    // Returns error response
    return res.status(500).send({ 
      error: "Failed to fetch users",
      details: error.message });
    }
};


// GET BY ID - Get a single user
exports.getByID = async (req, res) => {
    try {
        const user = await db.users.findByPk(req.params.UserID);

        if (!user) {
            return res.status(404).json({ error: `User with this ID does not exist ${req.params.UserID}.` });
        }

        return res.status(200).json({
            UserID: user.UserID,
            FullName: user.FullName,
            EmailAddress: user.EmailAddress,
            UserName: user.UserName,
            PhoneNumber2FA: user.PhoneNumber2FA,
            IsAdmin: user.IsAdmin
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            error: 'Failed to fetch user',
            details: error.message
        });
    }
};

// UPDATE - Updates a user's details
exports.update = async (req, res) => {
    try {
        const user = await db.users.findByPk(req.params.UserID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { FullName, EmailAddress, UserName, PhoneNumber2FA, IsAdmin } = req.body;

        if (!FullName || !EmailAddress || !UserName) {
            return res.status(400).json({
                error: "Missing required parameters. FullName, EmailAddress, and UserName are required."
            });
        }

        // Check if email is already taken by another user
        const existingEmail = await db.users.findOne({
            where: {
                EmailAddress: EmailAddress,
                UserID: { [db.Sequelize.Op.ne]: req.params.UserID }
            }
        });
        if (existingEmail) {
            return res.status(409).json({ error: "Email address is already in use by another user." });
        }

        // Check if username is already taken by another user
        const existingUsername = await db.users.findOne({
            where: {
                UserName: UserName,
                UserID: { [db.Sequelize.Op.ne]: req.params.UserID }
            }
        });
        if (existingUsername) {
            return res.status(409).json({ error: "Username is already in use by another user." });
        }

        let updateData = {
            FullName,
            EmailAddress,
            UserName,
            PhoneNumber2FA: PhoneNumber2FA || user.PhoneNumber2FA,
            IsAdmin: IsAdmin !== undefined ? IsAdmin : user.IsAdmin
        };

        if (req.body.PasswordHASH) {
            updateData.PasswordHASH = (await Utilities.gimmePassword(req.body.PasswordHASH)).toString();
        }

        await user.update(updateData);

        return res.status(200).json({
            UserID: user.UserID,
            FullName: user.FullName,
            EmailAddress: user.EmailAddress,
            UserName: user.UserName,
            PhoneNumber2FA: user.PhoneNumber2FA,
            IsAdmin: user.IsAdmin
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            error: 'Failed to update user',
            details: error.message
        });
    }
};

// DELETE - Removes a user
exports.delete = async (req, res) => {
    try {
        const user = await db.users.findByPk(req.params.UserID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Deletes all UserRatings belonging to this user first (foreign key constraint)
        await db.userRatings.destroy({
            where: { UserID: req.params.UserID }
        });

        await user.destroy();

        return res.status(204).send();

    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            error: 'Failed to delete user',
            details: error.message
        });
    }
};