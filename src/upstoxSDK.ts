import {UpstoxClient} from 'upstox-js-sdk';
import config from './config';
import { Request, Response } from 'express';

export const authorizeUpstox = (req:Request, res:Response) => {
  let apiInstance = new UpstoxClient.LoginApi();
  let clientId = config.API_KEY; // String | 
  let redirectUri = config.API_SECRET; // String | 
  let apiVersion = "2.0"; // String | API Version Header
  let opts = { 
    // 'state': "state_example", // String | 
    // 'scope': "scope_example" // String | 
  };
  apiInstance.authorize(clientId, redirectUri, apiVersion, (error:any, data:any, response:any) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully.', response, data);
    }
    res.send('done')
  });
}