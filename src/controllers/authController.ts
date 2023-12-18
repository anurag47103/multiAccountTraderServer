// authController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import config from '../config/config';
import { updateAccessToken } from '../services/updateEnv';


// Function to generate the Upstox auth URL
export const getAuthUrl = (req: Request, res: Response) => {
  const clientId: string = config.API_KEY;
  const redirectUri: string = config.REDIRECT_URI;
  const responseType: string = 'code';
  const state: string = generateRandomState();

  const authUrl: string = `${config.UPSTOX_BASE_URL}/login/authorization/dialog?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

  res.json({ authUrl });
};

// Function to handle the OAuth redirect and exchange the code for a token
export const handleAuthCallback = async (req: Request, res: Response) => {
  console.log('callback called')
  const { code, state } = req.query;

  if (typeof code !== 'string') {
    return res.status(400).send('Invalid code received.');
  }

  try {
    const params = {
      "code": code, 
      "client_id": config.API_KEY,
      "client_secret": config.API_SECRET, 
      "redirect_uri": config.REDIRECT_URI,
      "grant_type": "authorization_code",
    };
    
    const data = `code=${code}&client_id=7a2272fa-3743-43ed-92b5-7b1692d9da42&client_secret=it9s0u4j32&redirect_uri=http://localhost:4001/api/v1/authCallback&grant_type=authorization_code`;
    console.log(data);

    const response = await axios({
      method: 'post',
      url: 'https://api.upstox.com/v2/login/authorization/token',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    });
    // console.log(response)
    console.log('not using upstox sdk')
    const { access_token } = response.data;
    updateAccessToken(access_token);

    res.redirect(`${process.env.FRONTEND_URI}/?access_token=${access_token}`);
  } catch (error) {
    console.error('Token exchange failed:', error);
    res.status(500).send('Authentication failed.');
  }
};

// Function to generate a random state for OAuth security
const generateRandomState = (): string => {
  return crypto.randomBytes(16).toString('hex');
};
