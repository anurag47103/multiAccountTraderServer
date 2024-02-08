import  app from './server';
import { checkSequelizeConnection, getSequelizeInstance } from './sequelize';
import { syncModels } from './models/syncModels';

require('dotenv').config();

const PORT: string | number = process.env.PORT || 4001;


const startServer = async () => {
  try {
      const sequelize = getSequelizeInstance();
      checkSequelizeConnection();
      syncModels();
      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
      console.error('Failed to start the server:', error);
  }
};

startServer();
