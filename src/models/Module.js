const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Module extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Module.belongsToMany(models.action, {
                through: 'permission',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }

    Module.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            is_shown: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'module',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Module;
};
