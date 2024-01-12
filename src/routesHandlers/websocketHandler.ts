import {startWebSocketConnection} from "../controllers/marketFeedController";

export const startWebSocket = async (req, res) => {
    console.log(req.user);
    if(await startWebSocketConnection()){
        res.json({message: 'websocket connection'});
    }
}