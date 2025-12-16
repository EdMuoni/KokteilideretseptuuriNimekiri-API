const {db} = require('../db')
const Utilities = require('./Utilities')
const UUID = require('uuid')

exports.create =
async (req,res) => {
    if (
        !req.body.FullName ||
        !req.body.EmailAddress ||
        !req.body.PasswordHASH ||
        !req.body.UserName 
    ){
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
// ========================================
// GET ALL USERS
// ========================================
exports.getAllUsers = async (req, res) => {
  try {

    // Fetch all users from database
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

    }
};

// ========================================
// GET USER BY ID
// ========================================

exportts.getByID = 
async (req,res) => {
    const user = await getUser(req, res);
}

const getUser = 
async (req, res) => {
    const userID = req.params.UserID;
    const user = await db.users.findByPk(userID);
    if (!user) {
        res.status(404).json({error: `User with this ID does not exist ${userID}.`});
        return null;
    }
    return user;

}