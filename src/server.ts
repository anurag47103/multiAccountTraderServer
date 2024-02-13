import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";
import {startWebSocketConnection} from "./controllers/marketFeedController";
import {authenticateJWT} from "./middleware/authMiddleware";
import dashboardRoutes from "./routes/dashboardRoutes";
import {getCSVData} from "./routesHandlers/requestHandler";
import {getStockData} from "./services/utilServices";
import {setupCronJob} from "./services/removeExpiredToken";
import config from './config/config';
// import './models/syncModels'

const cookieParser = require('cookie-parser');

const app: express.Application = express();

setupCronJob();

const corsOptions = {
    origin: config.NODE_ENV === 'prod'
      ? 'https://multi-account-trader.vercel.app'
      : 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
  };

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use('/check', (req, res) => {
    res.status(200).send("Backend Working....");
})

app.use('/', (req, res) => {
    res.status(200).send('Server is running...')
})

app.use('/api/v1/auth/getAuthUrlCheck', (req, res) => {
    res.status(200).send('getAuthUrlCheck working....')
})

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/dashboard', authenticateJWT, dashboardRoutes);

app.get('/api/v1/getCSVData', authenticateJWT, getCSVData);


const initialize = async () => {
    startWebSocketConnection();

    getStockData();
}

initialize();

export default app;


