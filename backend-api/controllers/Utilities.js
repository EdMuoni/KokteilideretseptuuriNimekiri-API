const {db} = require('../db')
exports.getBaseURL = (req) => {
    return (req.connection && req.connection.encrypted ? "https":"http")+`://${req.headers.host}`;
}

exports.gimmePassword = async (passwordIntTXt) => {
    const saltRounds = 10;
    const newPassword = await bcrypt.hash(givenPassword, giveHASH); 
    return newPassword;
}

exports.letMeIn = async (givenPassword, giveHASH) => {
    const match = await bcrypt.compare(givenPassword, giveHASH);
    return match; 
}


