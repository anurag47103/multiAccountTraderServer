import express, {Router} from 'express';
import {
    addToWatchlistHandler,
    addUpstoxUserHandler,
    getAllFundsHandler,
    getAllHoldingsHandler,
    getAllOrdersHandler,
    getAllPositionsHandler,
    getStockDetailsHandler,
    getUpstoxAccountsHandler, getWatchlistForUserHandler, getWatchlistHandler,
    placeOrderHandler, removeFromWatchlistHandler, removeUpstoxUserHandler
} from "../routesHandlers/dashboardHandler";

const router: Router = express.Router();

router.get('/getUpstoxAccounts', getUpstoxAccountsHandler);

router.post('/addUpstoxUser', addUpstoxUserHandler);

router.post('/removeUpstoxUser', removeUpstoxUserHandler);

router.get('/getStockDetails', getStockDetailsHandler);

router.post('/placeOrder', placeOrderHandler);

router.post('/addToWatchlist', addToWatchlistHandler);

router.post('/removeFromWatchlist', removeFromWatchlistHandler);

router.get('/getWatchlist', getWatchlistHandler)

router.get('/getWatchlistForUser', getWatchlistForUserHandler)

router.get('/getAllHoldings', getAllHoldingsHandler);

router.get('/getAllOrders', getAllOrdersHandler);

router.get('/getAllPositions', getAllPositionsHandler);

router.get('/getAllFunds', getAllFundsHandler);

export default router;