import { Sequelize } from "sequelize";
import User from "./models/User";
import UpstoxUser from "./models/UpstoxUser";
import Watchlist from "./models/Watchlist";


const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'mydatabase',
    process.env.POSTGRES_USER_NAME || 'myuser',
    process.env.POSTGRES_PASSWORD || 'mypassword',
    {
        dialect: 'postgres',
        host: process.env.HOST || 'localhost'
    },
);

export default sequelize;

// syncSequelize();