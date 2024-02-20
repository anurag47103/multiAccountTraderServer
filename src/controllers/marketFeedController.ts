import config from '../config/config';
import WebSocket from 'ws';
import {getAllInstrumentKeys} from "../services/utilServices";
import { getServer } from '..';
const Upstox = require('upstox-js-sdk');

let defaultClient = Upstox.ApiClient.instance;
let OAUTH2 = defaultClient.authentications["OAUTH2"];
let backendWebSocket : WebSocket.Server = null;
let upstoxWebSocket : WebSocket = null;
const connectBackendWebSocket = async () : Promise<WebSocket.Server> => {

  return new Promise((resolve, reject) => {
    if(backendWebSocket === null)
      backendWebSocket = new WebSocket.Server({ server: getServer() });

    resolve(backendWebSocket);

    backendWebSocket.on('open', function open() {
      console.log('Connected to the server');
      resolve(backendWebSocket);
    });


    backendWebSocket.on('connection', (ws: WebSocket) => {
      console.log('React client connected');

      ws.on('close', () => {
        console.log('React client disconnected');
      });

      ws.on('message', (message) => {
        console.log('message from client' + message)
      })
    });
  })
}

const initialInstrumentKeys = ["NSE_INDEX|Nifty 50", "NSE_EQ|INE217K01011","NSE_EQ|INE002A01018","NSE_EQ|INE758T01015","NSE_EQ|INE933B01012","NSE_EQ|INE935A01035"];

export const sendInstrumentKeys = async () => {
  const instrument_keys : string[] = await getAllInstrumentKeys();

    setTimeout(() => {
      const data = {
        guid: "someguid",
        method: "sub",
        data: {
          mode: "ltpc",
          instrumentKeys: instrument_keys,
        },
      };
      upstoxWebSocket.send(Buffer.from(JSON.stringify(data)))
    }, 1000);
}

const connectUpstoxWebSocket = async (wsUrl: string) : Promise<WebSocket> => {

  return new Promise((resolve, reject) => {

     upstoxWebSocket = new WebSocket(wsUrl, {
      headers: {
        Authorization: `Bearer ${OAUTH2.accessToken}`,
      },
      followRedirects: true,
    } as WebSocket.ClientOptions);


    upstoxWebSocket.on("open", () => {
      console.log("connected");
      resolve(upstoxWebSocket);
    });


    upstoxWebSocket.on("close", () => {
      console.log("disconnected");
    });


    upstoxWebSocket.on("error", (error: Error) => {
      console.error("Error in connecting to upstox market-feed WebSocket : ", error.message);
      reject(error);
    });
  });
};

function broadcastToClients(data: Buffer, wss: WebSocket.Server) {
  // console.log('number of clients connected: ', wss.clients.size);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // console.log('trying to send message')
      client.send(data);
    }
    else {
      console.error("message not sent")
    }
  });
}

const getMarketFeedUrl = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let apiInstance = new Upstox.WebsocketApi();

    apiInstance.getMarketDataFeedAuthorize(
        config.API_VERSION,
        (error: any, data: any, response: any) => {
          if (error) reject(error);
          else resolve(data.data.authorizedRedirectUri);
        }
    );
  });
};

export const startWebSocketConnection = async () : Promise<boolean> => {
  if(upstoxWebSocket && backendWebSocket) return true;

  try {
    const access_token : string | undefined = await config.getAccessToken();

    if(!access_token) {
      console.error("Error in starting webSocket connection as access token is undefined.")
      return false;
    }

    OAUTH2.accessToken = access_token;

    const wsUrl = await getMarketFeedUrl();

    upstoxWebSocket = await connectUpstoxWebSocket(wsUrl);
    console.log('upstox ws working');

    await sendInstrumentKeys();

    backendWebSocket = await connectBackendWebSocket();
    console.log('backend ws working')


    upstoxWebSocket.on('message', (data: Buffer) => {
      // console.log("message from upstox")
      broadcastToClients(data, backendWebSocket);
    });

    return true;
  } catch (error) {
    console.error("An error occurred in websocket connection : ", error);
    return false;
  }
};


