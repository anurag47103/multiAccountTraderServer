import {startWebSocketConnection} from "../controllers/marketFeedController";

export const startWebSocket = async (req, res) => {
    if(await startWebSocketConnection()){
        res.json({message: 'websocket connection'});
    }
}