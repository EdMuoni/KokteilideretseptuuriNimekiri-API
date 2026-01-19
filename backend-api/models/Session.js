module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define(
        'Session', {
            SessionID: {
            type: DataTypes.UUID, // Unique identifier (UUID v4)
            defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
            primaryKey: true, //autoIncrement: true
        },
        
    })
    console.log(Session === sequelize.models.Session)
    return Session;
}