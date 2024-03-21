const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Action extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Action.belongsToMany(models.module, {
                through: 'permission',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }

    Action.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            code: DataTypes.STRING,
            is_custom: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'action',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Action;
};
