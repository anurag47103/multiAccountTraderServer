import express from 'express';
import cors from 'cors';
import {addUserProperty} from "./middleware/authMiddleware";
import authRoutes from "./routes/authRoutes";
import {startWebSocketConnection} from "./controllers/marketFeedController";
import {startWebSocket} from "./routesHandlers/websocketHandler";

const app: express.Application = express();

app.use(express.json());
app.use(cors());
app.use(addUserProperty)

app.use('/api/v1/auth', authRoutes);

app.post('/api/v1/startWebSocketConnection', startWebSocket)

export default app;


