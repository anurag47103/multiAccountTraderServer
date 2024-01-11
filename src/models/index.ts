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
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
checkDatabaseConnection();
export default models;
