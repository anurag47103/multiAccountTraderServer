import { Sequelize } from "sequelize";
import { syncModels } from "./models/syncModels";
import config  from "./config/config";

console.log('here is postgre host', config.POSTGRE_HOST);

let sequelizeInstance = null;

export function getSequelizeInstance() {
    if (!sequelizeInstance) {
      sequelizeInstance = new Sequelize(
        process.env.POSTGRES_DB || 'mab-database-1',
        process.env.POSTGRES_USER || 'myuser',
        process.env.POSTGRES_PASSWORD || 'mypassword',
        {
            dialect: 'postgres',
            host: config.POSTGRE_HOST || 'localhost',
            port: 5432,
            dialectOptions: {
                ssl: {
                  require: true,
                  rejectUnauthorized: false // Note: Setting this to false will allow the connection without validating the server certificate. It should only be used if you fully trust the server and the network between the client and the server.
                }
              }
        },
    );
    }
  
    return sequelizeInstance;
}


export function checkSequelizeConnection() {
    sequelizeInstance.authenticate()
        .then(() => {
            console.log('Database connected...')
        })
        .catch(err => console.error('Error: ' + err));
}