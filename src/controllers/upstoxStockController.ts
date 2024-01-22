import axios, {AxiosResponse} from "axios";
import {StockResponseData, UpstoxUserDetails} from "../types/types";
import config from "../config/config";

export const getStockDetails = async (instrument_key: string) : Promise<StockResponseData | undefined>  => {
    try {
        const access_token : string | undefined = await config.getAccessToken();

        if(!access_token) {
            console.error('Error in getting stock details as access token is undefined.');
            return undefined;
        }

        const getStockDetailsUrl = `${config.UPSTOX_BASE_URL}/market-quote/quotes?instrument_key=${instrument_key}`;


        const response  = await axios.get(getStockDetailsUrl, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });

        const data : StockResponseData = response.data.data;

        return data;
    } catch(error) {
        console.error('Error in fetching stock details from upstox: ', error);
        return undefined;
    }
}

export async function placeOrder(
                          instrument_key: string,
                          quantity: number = 1,
                          price: number = 0,
                          order_type: string = 'MARKET',
                          transaction_type: string = 'BUY',
                          trigger_price: number = 0,
                          product: string = 'D',
                          is_amo: boolean = false,
                          disclosed_quantity: number = 0,
                          validity: string = 'DAY',
                          tag: string = 'string') {

    try {
        const access_token : string = await config.getAccessToken();

        const requestBody = {
            instrument_token: instrument_key,
            quantity: quantity,
            price: price,
            order_type: order_type,
            transaction_type: transaction_type,
            trigger_price: trigger_price,
            product: product,
            is_amo: is_amo,
            disclosed_quantity: disclosed_quantity,
            validity: validity,
            tag: tag
        };

        const placeOrderUrl = `${config.UPSTOX_BASE_URL}/order/place`;
        const response  = await axios.post(placeOrderUrl, requestBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })

        console.log('order_id: ', response.data.order_id);
        return response.data.order_id;
    } catch(error) {
        console.log('error in placing order: ', error);
    }


}