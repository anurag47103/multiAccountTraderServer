// server.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { getAuthUrl, handleAuthCallback } from './authController';
import cors from 'cors';
import {authorizeUpstox} from './upstoxSDK'


dotenv.config();

const app: express.Application = express();

app.use(cors());

app.get('/api',(req, res) => {
  res.send('working');
})
app.get('/api/v1/getAuthUrl', getAuthUrl);
app.get('/api/v1/authCallback', handleAuthCallback);
app.get('/api/v1/authorizeUpstox', authorizeUpstox);
// app.get('/api/v1/authCallback', (req, res) => {
//   res.json({'message': 'hey2'})
// });

export default app;


