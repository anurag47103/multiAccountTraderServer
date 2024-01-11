import { Model, DataTypes } from 'sequelize';
import getSequelize from '../sequelize';
import UpstoxUser from './UpstoxUser';

const sequelize = getSequelize();
class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;

    public addUpstoxUser = async (upstoxUserData: {
        upstoxUserId: string,
        username: string,
        accessToken: string
    }): Promise<UpstoxUser> => {
        return UpstoxUser.create({
            ...upstoxUserData,
            userId: this.id // Set the foreign key to the current user's id
        });
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User'
});
export default User;
