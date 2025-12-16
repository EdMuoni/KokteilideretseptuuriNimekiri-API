
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User', {
            UserID: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            FullName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            EmailAddress: {
                type: DataTypes.STRING,
                allowNull: false
            },
            PasswordHASH: {
                type: DataTypes.STRING,
                allowNull: false
            },
            UserName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            PhoneNumber2FA: {
                type: DataTypes.STRING,
                
            },
            //LISTID ORDERS MISSING DUE TO TABLE MISSING
            // IsAdmin: {
            //     type: DataTypes.BOOLEAN,
            //     defaultValue: false
            // }
        }
    )
    console.log(User === sequelize.models.User)
    return User;
}