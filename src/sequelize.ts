import { Sequelize, Options } from 'sequelize';
import config from './config/config';

console.log('here is the PostgreSQL host', config.POSTGRE_HOST);

let sequelizeInstance: Sequelize | null = null;

export function getSequelizeInstance(): Sequelize {
  if (!sequelizeInstance) {
    const sequelizeOptions: Options = {
      dialect: 'postgres',
      host: config.POSTGRE_HOST || 'localhost',
      port: 5432,
    };

    if (config.NODE_ENV === 'prod') {
      sequelizeOptions.dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Note: Setting this to false will allow the connection without validating the server certificate. This should only be used if you fully trust the server and the network between the client and the server.
        },
      };
    }

    sequelizeInstance = new Sequelize(
      config.POSTGRES_DB || 'mydatabase',
      config.POSTGRES_USER || 'myuser',
      config.POSTGRES_PASSWORD || 'mypassword',
      sequelizeOptions,
    );
  }

  return sequelizeInstance;
}

export function checkSequelizeConnection(): void {
  sequelizeInstance?.authenticate()
    .then(() => {
      console.log('Database connected...');
    })
    .catch(err => {
      console.error('Error: ' + err);
    });
}
