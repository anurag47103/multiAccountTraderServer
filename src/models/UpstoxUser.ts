import {Model, DataTypes, Sequelize} from 'sequelize';
import sequelize from '../sequelize'

if(sequelize == undefined) {
    console.error('Sequelize instance is undefined : ');
}

class UpstoxUser extends Model {
    public id!: number;
    public user_id!: number;
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
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessToken: {
        type: DataTypes.STRING(1000),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UpstoxUser'
});



export default UpstoxUser;
