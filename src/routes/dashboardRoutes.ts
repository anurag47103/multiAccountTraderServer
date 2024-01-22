import express, {Router} from 'express';
import {
    addToWatchlistHandler,
    getStockDetailsHandler,
    getUpstoxAccountsHandler, getWatchlistForUserHandler, getWatchlistHandler,
    placeOrderHandler, removeToWatchlistHandler
} from "../routesHandlers/dashboardHandler";
import {getWatchlistForUser} from "../controllers/WatchlistController";

const router: Router = express.Router();

router.get('/getUpstoxAccounts', getUpstoxAccountsHandler);

router.get('/getStockDetails', getStockDetailsHandler);

router.post('/placeOrder', placeOrderHandler);

router.post('/addToWatchlist', addToWatchlistHandler);

router.post('/removeFromWatchlist', removeToWatchlistHandler);

router.get('/getWatchlist', getWatchlistHandler)

router.get('/getWatchlistForUser', getWatchlistForUserHandler)
export default router;