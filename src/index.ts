import  app from './server';
import { checkSequelizeConnection, getSequelizeInstance } from './sequelize';
import { syncModels } from './models/syncModels';
import { createServer } from 'http';
import { getServers } from 'dns';

require('dotenv').config();

const PORT: string | number = process.env.PORT || 4001;

const server = createServer(app);

const startServer = async () => {
  try {
      const sequelize = getSequelizeInstance();
      checkSequelizeConnection();
      syncModels();
      
      server.listen(PORT, () => {
          console.log(`Server is running on port:  ${PORT}`);
      });

  } catch (error) {
      console.error('Failed to start the server:', error);
  }
};

startServer();

export const getServer = () => {
    return server;
}
