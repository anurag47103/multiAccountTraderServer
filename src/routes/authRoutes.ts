import express from 'express';
import {
    authCallbackHandler,
    getAuthUrlHandler,
    loginUserHandler,
    registerUserHandler
} from "../routesHandlers/authHandler";

const router = express.Router();

router.post('/register', registerUserHandler);

router.post('/login', loginUserHandler);

router.get('/getAuthUrl', getAuthUrlHandler);

router.get('/authCallback', authCallbackHandler);

export default router;
