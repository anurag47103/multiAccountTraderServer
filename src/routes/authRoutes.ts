import express from 'express';
import {
    authCallbackHandler,
    getAuthUrlHandler,
    loginUserHandler, logoutUpstoxAccountHandler,
    registerUserHandler
} from "../routesHandlers/authHandler";
import {authenticateJWT} from "../middleware/authMiddleware";

const router = express.Router();

router.post('/register', registerUserHandler);

router.post('/login', loginUserHandler);

router.get('/getAuthUrl', authenticateJWT, getAuthUrlHandler);

router.get('/authCallback', authenticateJWT, authCallbackHandler);

router.delete('/logoutUpstoxAccount', authenticateJWT, logoutUpstoxAccountHandler);

// router.get('verifyToken', )

export default router;
