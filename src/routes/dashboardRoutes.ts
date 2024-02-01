import express, {Router} from 'express';
import {
    addToWatchlistHandler,
    addUpstoxUserHandler,
    getAllHoldingsHandler,
    getStockDetailsHandler,
    getUpstoxAccountsHandler, getWatchlistForUserHandler, getWatchlistHandler,
    placeOrderHandler, removeToWatchlistHandler, removeUpstoxUserHandler
} from "../routesHandlers/dashboardHandler";
import { removeUpstoxUser } from '../controllers/upstoxUserController';

const router: Router = express.Router();

router.get('/getUpstoxAccounts', getUpstoxAccountsHandler);

router.post('/addUpstoxUser', addUpstoxUserHandler);

router.post('/removeUpstoxUser', removeUpstoxUserHandler);

router.get('/getStockDetails', getStockDetailsHandler);

router.post('/placeOrder', placeOrderHandler);

router.post('/addToWatchlist', addToWatchlistHandler);

router.post('/removeFromWatchlist', removeToWatchlistHandler);

router.get('/getWatchlist', getWatchlistHandler)

router.get('/getWatchlistForUser', getWatchlistForUserHandler)

router.get('/getAllHoldings', getAllHoldingsHandler);

export default router;