module.exports = (sequelize, DataTypes) => {
    const UserRating = sequelize.define(
        'UserRating', {
        UserRatingID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            //autoIncrement: true
        },
        UserScore : {
            type: DataTypes.DECIMAL,
            allowNull: false
        }

    });
    console.log(UserRating === sequelize.models.UserRating)
    return UserRating;
}
        