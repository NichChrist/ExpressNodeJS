const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ActivityLog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ActivityLog.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
                allowNull: false,
            },
            action: DataTypes.ENUM('create', 'update', 'delete'),
            table: DataTypes.STRING,
            target_id: DataTypes.UUID,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'activity_log',
            underscored: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return ActivityLog;
};
