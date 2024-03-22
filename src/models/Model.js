const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Models extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Models.belongsToMany(models.action, {
                through: 'permission',
                foreignKey: 'model_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                hooks: true,
            });
        }
    }

    Models.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_shown: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'model',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Models;
};
