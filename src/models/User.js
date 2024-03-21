const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsToMany(models.role, {
                through: 'user_role',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });

            User.belongsToMany(models.product, {
                through: 'user_product',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                allowNull: false,
            },
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            scopes: {
                withoutPassword: {
                    attributes: { exclude: ['password'] },
                },
                withoutTimestamp: {
                    attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
                },
                dropdown: {
                    attributes: [
                        'id',
                        'email',
                        [sequelize.literal("first_name || ' ' || last_name"), 'full_name'],
                    ]
                },
            },
            sequelize,
            modelName: 'user',
            underscored: true,
        }
    );
    return User;
};
