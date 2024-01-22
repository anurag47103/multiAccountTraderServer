import {AccountDetails, StockResponseData, StockDetails} from "../types/types";
import {getUpstoxUsersForUser} from "../controllers/userController";
import {getStockDetails, placeOrder} from "../controllers/upstoxStockController";
import {
    addToWatchlist,
    getAllWatchlist,
    getWatchlistForUser,
    removeFromWatchlist
} from "../controllers/WatchlistController";


export const getUpstoxAccountsHandler = async (req, res)  => {
    const upstoxUsers = await getUpstoxUsersForUser(req.user.user_id);

    const accountDetails: AccountDetails[] = upstoxUsers.map((upstoxUser) => {
        return {upstoxUsername: upstoxUser.username, upstoxUserId: upstoxUser.upstoxUserId};
    })

    console.log(accountDetails)
    res.json({accountDetails: accountDetails});
}

export const getStockDetailsHandler = async (req , res)  => {
    const { instrument_key } = req.query;

    if(!instrument_key){
        console.error("Error in getStockDetailsHandler as instrument_key is undefined");
        return res.status(500).send("Error in getStockDetailsHandler as instrument_key is undefined");
    }

    const stockDetailsResponse : StockResponseData | undefined = await getStockDetails(instrument_key);

    if(!stockDetailsResponse) {
        return res.status(500).send('Error in getting stock Details from upstox');
    }

    const stockResult : StockDetails[] = Object.entries(stockDetailsResponse).map(([key , data ]) => {
        return {
            name: key.split(':')[1],
            exchange: key.split(':')[0],
            price: data.last_price,
            change: data.net_change,
            instrument_key: data.instrument_token
        }
    })

    res.json(stockResult);
}

export const placeOrderHandler = async (req, res) => {
    const { instrument_key, quantity, price, order_type, transaction_type, trigger_price, product, is_amo, disclosed_quantity, validity, tag} = req.query;

    const response = await placeOrder(instrument_key, quantity, price, order_type, transaction_type, trigger_price, product, is_amo, disclosed_quantity, validity, tag);

    res.json(response);
}

export const addToWatchlistHandler = async (req, res) => {
    const { instrument_key, userId} = req.body;

    console.log(instrument_key, userId)

    const response : boolean = await addToWatchlist(instrument_key, userId);

    if(response) res.status(201).send(`Added to Watchlist ${instrument_key} for User : ${userId}`);
    else res.status(500).send('Error in adding the stock to Watchlist');
}

export const removeToWatchlistHandler = async (req, res) => {
    const { instrument_key, userId} = req.body;

    const response : boolean = await removeFromWatchlist(instrument_key, userId);

    if(response) res.status(201).send(`Remove from Watchlist ${instrument_key} for User : ${userId}`);
    else res.status(500).send('Error in removing the stock from the Watchlist');
}

export const getWatchlistHandler = async (req, res) => {
    const response = await getAllWatchlist();

    return response;
}

export const getWatchlistForUserHandler = async (req, res) => {
    const { userId } = req.query;
    console.log('userID for getWatchlistForUser: ', userId);
     const response  = await getWatchlistForUser(userId);

     const formatedResponse = response.map(watchlist => {
         return watchlist.instrument_key;
     })

     res.status(200).json(formatedResponse);
}
