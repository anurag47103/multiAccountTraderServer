import getSequelize from "../sequelize";
import User from './User';
import UpstoxUser from './UpstoxUser';

const sequelize = getSequelize();

const models = {
    User,
    UpstoxUser
};

async function checkDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        User.hasMany(UpstoxUser, {foreignKey: 'user_id'});

        UpstoxUser.belongsTo(User, { foreignKey: 'user_id' });

        sequelize.sync({ force: false, alter: true }).then(() => {
            console.log('All tables were created or updated');
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
checkDatabaseConnection();
export default models;
