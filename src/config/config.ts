import dotenv from 'dotenv';
import {getAccessTokenFromAnyUpstoxUser} from "../controllers/upstoxUserController";

dotenv.config({ path: `${__dirname}/../../.env` });

const API_KEY = process.env.API_KEY || '';
const API_SECRET = process.env.API_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';
const UPSTOX_BASE_URL = process.env.UPSTOX_BASE_URL || '';
const API_VERSION = process.env.API_VERSION || '2.0';
const FRONTEND_URI = process.env.FRONTEND_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const NODE_ENV = process.env.NODE_ENV || 'dev';
const CSV_FILE_PATH = NODE_ENV === 'dev' ? process.env.CSV_FILE_PATH_LOCAL : process.env.CSV_FILE_PATH_DOCKER;
const POSTGRE_HOST = NODE_ENV === 'docker' ? 'db' : process.env.POSTGRES_HOST;
const POSTGRES_DB = NODE_ENV === 'dev' ? process.env.POSTGRES_RDS_DB : process.env.POSTGRES_DB;
const POSTGRES_USER = NODE_ENV === 'dev' ? process.env.POSTGRES_RDS_USER : process.env.POSTGRES_USER;
const POSTGRES_PASSWORD =  NODE_ENV === 'dev' ? process.env.POSTGRES_RDS_PASSWORD : process.env.POSTGRES_PASSWORD;
const RDS_PASSWORD_SECRET_NAME = process.env.RDS_PASSWORD_SECRET_NAME;
const RDS_PASSWORD_REGION = process.env.RDS_PASSWORD_REGION;

const getAccessToken = async() : Promise<string | undefined> => {
    const access_token : string | undefined = await getAccessTokenFromAnyUpstoxUser();
    return access_token;
}

export default {
    NODE_ENV,
    API_KEY,
    API_SECRET,
    REDIRECT_URI,
    UPSTOX_BASE_URL,
    API_VERSION,
    FRONTEND_URI,
    JWT_SECRET,
    getAccessToken,
    CSV_FILE_PATH,
    POSTGRE_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    RDS_PASSWORD_SECRET_NAME,
    RDS_PASSWORD_REGION
};

