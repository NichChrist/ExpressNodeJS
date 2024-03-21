const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Permission.belongsToMany(models.role, {
                through: 'role_permission',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
            Permission.belongsTo(models.module, {
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
            Permission.belongsTo(models.action, {
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }

    Permission.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: 'permission',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Permission;
};
