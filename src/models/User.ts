import { Model, DataTypes } from 'sequelize';
import getSequelize from '../sequelize';
import UpstoxUser from './UpstoxUser';

const sequelize = getSequelize();
class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;

    public async addUpstoxUser(upstoxUserData: {
        upstoxUserId: string,
        username: string,
        accessToken: string
    }): Promise<UpstoxUser> {
        const upstoxUser = await UpstoxUser.create({
            ...upstoxUserData,
            user_id: this.id // Assuming 'UserId' is the foreign key in the 'UpstoxUser' model
        });

        // If you have set up an association, you might need to do something like this instead:
        // const upstoxUser = await this.createUpstoxUser(upstoxUserData);

        return upstoxUser;
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
