
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
        const bodycontent = req.body;
        var errors = "";
        switch(bodycontent) 
        {
            case !req.body.FullName:
                errors+="FullName, "
                break;
            case !req.body.EmailAddress:
                errors+="EmailAddress, "
                break;
            case !req.body.PasswordHASH:
                errors+="Password, "
                break;
            case !req.body.UserName:
                errors+="UserName, "
                break;
            default:
                break;
        }
        console.log(errors);
        
        return res.status(400).send({error:`Missing some parameter: ${errors}`})
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