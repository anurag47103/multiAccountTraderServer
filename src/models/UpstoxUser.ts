import {Model, DataTypes, Sequelize} from 'sequelize';
import { getSequelizeInstance } from '../sequelize'

const sequelize = getSequelizeInstance();

if(!sequelize){
    console.error('Sequelize instance is empty in watchlist.')
}

class UpstoxUser extends Model {
    public id!: number;
    public user_id!: number;
    public upstoxUserId!: string;
    public username!: string;
    public accessToken!: string;
    public apiKey!: string;
    public apiSecret!: string;
    public isLoggedIn!: boolean;
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
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    accessToken: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
    apiKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apiSecret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isLoggedIn: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UpstoxUser'
});



export default UpstoxUser;
