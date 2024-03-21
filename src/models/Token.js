const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    }

    Token.init(
        {
            token: DataTypes.STRING,
            user_id: DataTypes.UUID,
            type: DataTypes.STRING,
            expires: DataTypes.DATE,
            blacklisted: DataTypes.BOOLEAN,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'token',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    );
    return Token;
};
