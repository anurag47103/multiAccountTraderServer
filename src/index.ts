import { syncModels } from './models/syncModels';
import  app from './server';
const PORT: string | number = process.env.PORT || 4001;

const startServer = async () => {
  try {
    //   await syncModels(); // Ensure models are synced before starting the server
      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
      console.error('Failed to start the server:', error);
  }
};

startServer();
