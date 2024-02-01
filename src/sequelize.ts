import { Sequelize } from "sequelize";
import { syncModels } from "./models/syncModels";


const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'mydatabase',
    process.env.POSTGRES_USER_NAME || 'myuser',
    process.env.POSTGRES_PASSWORD || 'mypassword',
    {
        dialect: 'postgres',
        host: process.env.HOST || 'localhost',
        logging: false
    },
);

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...')
        // syncModels();
    })
    .catch(err => console.log('Error: ' + err));

export default sequelize;