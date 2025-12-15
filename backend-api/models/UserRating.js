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
        },
        UserComment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        RecipeID: {
            type: DataTypes.UUID,
            allowNull: false
        }
    });
    console.log(UserRating === sequelize.models.UserRating)
    return UserRating;
}
        