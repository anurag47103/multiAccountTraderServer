import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';
const UPSTOX_BASE_URL = process.env.UPSTOX_BASE_URL || '';

export default {
    API_KEY,
    API_SECRET,
    REDIRECT_URI,
    ACCESS_TOKEN,
    UPSTOX_BASE_URL
};
