import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";
import {startWebSocketConnection} from "./controllers/marketFeedController";
import {authenticateJWT} from "./middleware/authMiddleware";
import dashboardRoutes from "./routes/dashboardRoutes";
const cookieParser = require('cookie-parser');

const app: express.Application = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's actual origin
    credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/dashboard', authenticateJWT, dashboardRoutes);


startWebSocketConnection()

export default app;


