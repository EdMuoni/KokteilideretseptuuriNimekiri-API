const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


exports.getByID = async (req, res) => {
    try {
        const user = await db.Users.findByPk(req.params.UserID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return user data without password hash (security!)
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



exports.update = async (req, res) => {
    try {
        const user = await db.Users.findByPk(req.params.UserID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validating required fields
        const { FullName, EmailAddress, UserName, PhoneNumber2FA, IsAdmin } = req.body;

        if (!FullName || !EmailAddress || !UserName) {
            return res.status(400).json({
                error: "Missing required parameters. FullName, EmailAddress, and UserName are required."
            });
        }

        // Checks if email is already taken by another user
        const existingEmail = await db.Users.findOne({
            where: {
                EmailAddress: EmailAddress,
                UserID: { [db.Sequelize.Op.ne]: req.params.UserID }
            }
        });

        if (existingEmail) {
            return res.status(409).json({ error: "Email address is already in use by another user." });
        }

        // Checks if username is already taken by another user
        const existingUsername = await db.Users.findOne({
            where: {
                UserName: UserName,
                UserID: { [db.Sequelize.Op.ne]: req.params.UserID }
            }
        });

        if (existingUsername) {
            return res.status(409).json({ error: "Username is already in use by another user." });
        }

        // During password update, hashes the new password
        let updateData = {
            FullName,
            EmailAddress,
            UserName,
            PhoneNumber2FA: PhoneNumber2FA || user.PhoneNumber2FA,
            IsAdmin: IsAdmin !== undefined ? IsAdmin : user.IsAdmin
        };

        if (req.body.PasswordHASH) {
            const salt = await bcrypt.genSalt(10);
            updateData.PasswordHASH = await bcrypt.hash(req.body.PasswordHASH, salt);
        }

        // Update the user
        await user.update(updateData);

        // Return updated user data (without password)
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


exports.delete = async (req, res) => {
    try {
        const user = await db.Users.findByPk(req.params.UserID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

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