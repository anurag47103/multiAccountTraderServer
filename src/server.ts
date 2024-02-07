import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";
import {startWebSocketConnection} from "./controllers/marketFeedController";
import {authenticateJWT} from "./middleware/authMiddleware";
import dashboardRoutes from "./routes/dashboardRoutes";
import {getCSVData} from "./routesHandlers/requestHandler";
import {getStockData} from "./services/utilServices";
import {setupCronJob} from "./services/removeExpiredToken";
// import './models/syncModels'

const cookieParser = require('cookie-parser');

const app: express.Application = express();

setupCronJob();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use('/check', (req, res) => {
    res.status(200).send("Backend Working");
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


