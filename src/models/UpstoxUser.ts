import { Model, DataTypes } from 'sequelize';
import getSequelize from "../sequelize";

const sequelize = getSequelize();

class UpstoxUser extends Model {
    public id!: number;
    public upstoxUserId!: string;
    public username!: string;
    public accessToken!: string;
}

UpstoxUser.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: false
    },
    upstoxUserId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UpstoxUser'
});



export default UpstoxUser;
