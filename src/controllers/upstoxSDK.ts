// import { UpstoxClient } from 'upstox-js-sdk';
const UpstoxClient = require('upstox-js-sdk');

import config from '../config/config';
import { Request, Response } from 'express';
let defaultClient = UpstoxClient.ApiClient.instance;
let apiVersion = "2.0";
let OAUTH2 = defaultClient.authentications["OAUTH2"];
OAUTH2.accessToken = config.ACCESS_TOKEN;

export const authorizeUpstox = (req:Request, res:Response) => {
  console.log('request received');
  let apiInstance = new UpstoxClient.LoginApi();
  console.log(apiInstance)
  let clientId = config.API_KEY;  
  let redirectUri = config.REDIRECT_URI;  
  let opts = { 
    // 'state': "state_example",  
    // 'scope': "scope_example"  
  };
  
  apiInstance.authorize(clientId, redirectUri, apiVersion, opts, (error:any, data:any, response:any) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully' , data);
    }
    // return res.send('done')
  });
  
  // return res.send('not done')
}

export const getToken = (req: Request, res: Response) => {
  const { code, state } = req.query;
  let apiInstance = new UpstoxClient.LoginApi();

  let clientId = config.API_KEY;  
  let clientSecret = config.API_SECRET;
  let redirectUri = config.REDIRECT_URI;  
  let apiVersion = "2.0";
  console.log(code)
  let opts = { 
    'code': code,  
    'clientId': clientId,  
    'clientSecret': clientSecret,  
    'redirectUri': redirectUri,  
    'grantType': "authorization_code"  
  };

  apiInstance.token(apiVersion, opts, (error, data, response) => {
    if (error) {
      console.error('Error in apiInstance.token()');
    } else {
      console.log('API called successfully');
    }
  });

  res.send();
}