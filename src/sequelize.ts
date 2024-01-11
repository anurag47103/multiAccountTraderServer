import { Sequelize } from "sequelize";

let sequelize: Sequelize;

export default function getSequelize() : Sequelize {
    if(!sequelize) {
        sequelize = new Sequelize(
            process.env.POSTGRES_DB || 'mydatabase',
            process.env.POSTGRES_USER_NAME || 'myuser',
            process.env.POSTGRES_PASSWORD || 'mypassword',
            {
                dialect: 'postgres',
                host: process.env.HOST || 'localhost'
            },
        )
    }
    console.log(sequelize)
    return sequelize;
}

async function checkDatabaseConnection() {
    sequelize = getSequelize();
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    sequelize.sync({ force: false, alter: true }).then(() => {
        console.log('All tables were created or updated');
    });
}

checkDatabaseConnection();