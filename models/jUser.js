
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM('0','1','2'),
            allowNull: false,
            defaultValue: '0'
        }
    }, {
        timestamps: false,
        underscored: true // Use snake_case for column names
    });

    return User;
}

