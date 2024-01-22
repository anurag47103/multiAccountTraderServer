import {startWebSocketConnection} from "../controllers/marketFeedController";
import {getStockData} from "../services/utilServices";

export const startWebSocket = async (req, res) => {
    console.log(req.user);
    if(await startWebSocketConnection()){
        res.json({message: 'websocket connection'});
    }
}

export const getCSVData = async (req, res) => {
    try{
        const result = await getStockData();
        res.json(result);
    } catch (error) {
        console.error('Error sending csv file data: ', error);
    }
}