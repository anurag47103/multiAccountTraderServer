import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

const API_KEY = process.env.API_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';
const UPSTOX_BASE_URL = process.env.UPSTOX_BASE_URL || '';
const API_VERSION = process.env.API_VERSION || '2.0';
const FRONTEND_URI = process.env.FRONTEND_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || '';


export default {
    API_KEY,
    API_SECRET,
    REDIRECT_URI,
    ACCESS_TOKEN,
    UPSTOX_BASE_URL,
    API_VERSION,
    FRONTEND_URI,
    JWT_SECRET
};
