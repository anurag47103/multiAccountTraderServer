import { Model, DataTypes } from 'sequelize';
import UpstoxUser from './UpstoxUser';
import sequelize from '../sequelize'
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

        try {
            console.log(upstoxUserData.upstoxUserId, upstoxUserData.username, upstoxUserData.accessToken);
            const [upstoxUser, created] = await UpstoxUser.findOrCreate({
                where: {upstoxUserId: upstoxUserData.upstoxUserId},
                defaults: {
                    ...upstoxUserData,
                    user_id: this.id
                }
            });

            console.log('created : ', created);

            if (!created) {
                upstoxUser.accessToken = upstoxUserData.accessToken;
                await upstoxUser.save();
            }

            return upstoxUser;
        } catch(error) {
            console.error('Error in adding UpstoxUser in user: ', error);
        }
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
