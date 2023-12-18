// server.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { getAuthUrl, handleAuthCallback } from './controllers/authController';
import cors from 'cors';
import {authorizeUpstox, getToken} from './controllers/upstoxSDK'


dotenv.config();

const app: express.Application = express();

app.use(cors());

app.get('/api',(req, res) => {
  res.send('working');
})
app.get('/api/v1/getAuthUrl', getAuthUrl);
app.get('/api/v1/authCallback', handleAuthCallback);
// app.get('/api/v1/authCallback', getToken);
app.get('/api/v1/authorizeUpstox', authorizeUpstox);
app.get('/api/v1/getToken', getToken);

export default app;


