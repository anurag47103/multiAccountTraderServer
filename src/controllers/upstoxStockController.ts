import axios, {AxiosResponse} from "axios";
import {StockResponseData, UpstoxUserDetails} from "../types/types";
import config from "../config/config";
import UpstoxUser from "../models/UpstoxUser";
import { getAllUpstoxUser } from "./upstoxUserController";

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

export const getHoldingsForUpstoxUser = async (upstoxUser: UpstoxUser) => {

    try {
        const getHoldingsUrl = `${config.UPSTOX_BASE_URL}/portfolio/long-term-holdings`;

        const response = await axios.get(getHoldingsUrl, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${upstoxUser.accessToken}`
            }
        });

        const holdings: Holding[] = response.data.data.map((item: any) => ({
            isin: item.isin,
            company_name: item.company_name,
            product:item.product,
            quantity: item.quantity,
            last_price: item.last_price,
            close_price: item.close_price,
            pnl: item.pnl,
            day_change: item.day_change,
            day_change_percentage: item.day_change_percentage,
            instrument_token: item.instrument_token,
            average_price: item.average_price,
            trading_symbol: item.trading_symbol,
            exchange: item.exchange
          }));

          return holdings;
    } catch(error) {
        console.error('Error in getting holdings for upstox User');
    }
}

type Holding = {
    isin: string;
    company_name: string;
    product: string;
    quantity: number;
    last_price: number;
    close_price: number;
    pnl: number;
    day_change: number;
    day_change_percentage: number;
    instrument_token: string;
    average_price: number;
    trading_symbol: string;
    exchange: string;
    day_pnl: number;
    pnl_percentage: number;
    current_value: number;
  };

type HoldingResponse = {
    clients: Client[],
    overall_pnl : number,
    overall_day_pnl : number,
    overall_invested : number,
    overall_current : number,
}

type Client = {
    upstoxUserId: string,
    holdings: Holding[],
    pnl: Pnl,
}

interface Pnl {
    overall_pnl : number,
    overall_pnl_percentage : number,
    day_pnl : number,
    day_pnl_percentage : number,
    invested: number,
    current: number
}

export const getAllHoldings = async () => {
    const upstoxUsers : UpstoxUser[] = await getAllUpstoxUser();

    let clients = [];
    let overall_pnl = 0;
    let overall_day_pnl = 0;
    let overall_invested = 0;
    let overall_current = 0;

    for (const upstoxUser of upstoxUsers) {
        let pnl = 0;
        let day_pnl = 0;
        let invested = 0;
        let current = 0;

        const holdings : Holding[] = await getHoldingsForUpstoxUser(upstoxUser);

        console.log('holdings -> ', holdings)

        holdings.forEach(stock => {
            stock.current_value = parseFloat((stock.last_price * stock.quantity).toFixed(2));
            stock.day_pnl = parseFloat(((stock.last_price - stock.close_price) * stock.quantity).toFixed(2));
            stock.pnl_percentage = parseFloat((stock.pnl / (stock.current_value - stock.pnl) * 100).toFixed(2));

            pnl += stock.pnl;
            day_pnl += stock.day_pnl;
            invested = parseFloat(invested + (stock.average_price * stock.quantity).toFixed(2));
            current += stock.current_value;
        });

        const client: Client = {
            upstoxUserId: upstoxUser.upstoxUserId,
            holdings: holdings,
            pnl: {
                overall_pnl: pnl,
                overall_pnl_percentage : invested === 0 ? 0 : parseFloat((pnl / invested * 100).toFixed(2)),
                day_pnl: day_pnl,
                day_pnl_percentage: invested===0 ? 0 : parseFloat((day_pnl/invested * 100).toFixed(2)),
                invested: invested,
                current: current
            }
        }

        overall_pnl += pnl;
        overall_day_pnl += day_pnl; 
        overall_invested += invested;
        overall_current += current;
        
        clients.push(client);
    }

    const holdingResponse : HoldingResponse = {
        clients: clients,
        overall_pnl: overall_pnl,
        overall_current: overall_current,
        overall_day_pnl: overall_day_pnl,
        overall_invested: overall_invested
    }

    
    return holdingResponse;

}