import axios, {AxiosResponse} from "axios";
import {StockResponseData, UpstoxUserDetails} from "../types/types";
import config from "../config/config";
import UpstoxUser from "../models/UpstoxUser";
import { getAccessTokenFromUpstoxUser, getAllUpstoxUser } from "./upstoxUserController";

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

type PlaceOrderResponse = {
    status:string, 
    upstoxUserId: string, 
    orderId: string
}

export async function placeOrderForUpstoxUser(
                          instrument_key: string,
                          quantity: number,
                          price: number ,
                          order_type: string,
                          transaction_type: string,
                          trigger_price: number ,
                          product: string,
                          is_amo: boolean = true,
                          disclosed_quantity: number ,
                          validity: string,
                          tag: string,
                          upstoxUserId: string) : Promise<PlaceOrderResponse> {

    try {
        const access_token : string = await getAccessTokenFromUpstoxUser(upstoxUserId);

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

        console.log(requestBody);

        const placeOrderUrl = `${config.UPSTOX_BASE_URL}/order/place`;
        const response  = await axios.post(placeOrderUrl, requestBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
        console.log(response.data)
        return {status: response.data.status, upstoxUserId: upstoxUserId, orderId: response.data.order_id};
    } catch(error) {
        console.error('error in placing order: ', error);
        return {status: 'failed', upstoxUserId: upstoxUserId, orderId: null};
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

        console.log('response for holdings: ', response.data.data);

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
    clients: HoldingClient[],
    overall_pnl : number,
    overall_day_pnl : number,
    overall_invested : number,
    overall_current : number,
    overall_pnl_percentage: number, 
    overall_day_pnl_percentage: number,
}

type HoldingClient = {
    upstoxUserId: string,
    upstoxUsername: string,
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

        console.log('holdings: ', holdings)

        holdings.forEach(stock => {
            stock.current_value = parseFloat((stock.last_price * stock.quantity).toFixed(2));
            stock.day_pnl = parseFloat(((stock.last_price - stock.close_price) * stock.quantity).toFixed(2));
            stock.pnl_percentage = parseFloat((stock.pnl / (stock.current_value - stock.pnl) * 100).toFixed(2));

            pnl += stock.pnl;
            day_pnl += stock.day_pnl;
            invested += (stock.average_price * stock.quantity);
            current += stock.current_value;
        });

        const client: HoldingClient = {
            upstoxUserId: upstoxUser.upstoxUserId,
            upstoxUsername: upstoxUser.username,
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

    const overall_pnl_percentage = overall_pnl / (overall_invested) * 100;
    const overall_day_pnl_percentage = overall_day_pnl / overall_invested * 100;

    const holdingResponse : HoldingResponse = {
        clients: clients,
        overall_pnl: overall_pnl,
        overall_current: overall_current,
        overall_day_pnl: overall_day_pnl,
        overall_invested: parseFloat(overall_invested.toFixed(2)),
        overall_pnl_percentage,
        overall_day_pnl_percentage
    }

    return holdingResponse;
}

type Orders = {
    upstoxUserId: string,
    upstoxUsername: string,
    exchange: string,
    product: string,
    price: number,
    quantity: number,
    status: string,
    instrument_token: string,
    placed_by: string,
    trading_symbol: string,
    order_type: string, 
    validity: string,
    trigger_price: number,
    transaction_type: string,
    average_price: number,
    filled_quantity: number,
    pending_quantity: number,
    order_id: string,
    order_timestamp: string,
    is_amo: boolean
    order_ref_id: string
}


type OrderResponse = {
    orders: Orders[];
}

export const getOrdersForUpstoxUser = async (upstoxUser: UpstoxUser) => {
    try {
        const getOrdersUrl : string = `${config.UPSTOX_BASE_URL}/order/retrieve-all`

        const response = await axios.get(getOrdersUrl, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${upstoxUser.accessToken}`
            }
        });

        const orders: Orders[] = response.data.data.map((item: any) => ({
            upstoxUserId: upstoxUser.upstoxUserId,
            upstoxUsername: upstoxUser.username,
            exchange:item.exchange,
            product:item.product,
            price:item.price,
            quantity:item.quantity,
            status:item.status,
            instrument_token:item.instrument_token,
            placed_by:item.placed_by,
            trading_symbol:item.trading_symbol,
            order_type:item.order_type, 
            validity:item.validity,
            trigger_price:item.trigger_price,
            transaction_type:item.transaction_type,
            average_price:item.average_price,
            filled_quantity:item.filled_quantity,
            pending_quantity:item.pending_quantity,
            order_id:item.order_id,
            order_timestamp:item.order_timestamp,
            is_amo:item.is_amo,
            order_ref_id: item.order_ref_id
          }));

          return orders;

    } catch(error) {
        console.error('Error in getOrdersForUpstoxUser.', error)
    }
}

export const getAllOrders = async () => {
    try {
        const upstoxUsers : UpstoxUser[] = await getAllUpstoxUser();

        let orders : Orders[] = [];
        
        for(const upstoxUser of upstoxUsers) {
            const user_orders : Orders[] = await getOrdersForUpstoxUser(upstoxUser);
            orders = orders.concat(user_orders);
        };

        const orderResponse : OrderResponse = {
            orders: orders
        }

        return orderResponse;
    }
     catch(error) {
        console.error('Error in getAllOrders', error);
    }
}

type Position = {
    exchange: string;
    multiplier: number;
    value: number;
    pnl: number;
    product: string;
    instrument_token: string;
    average_price: number;
    quantity: number;
    last_price: number;
    close_price: number;
    buy_price: number;
    sell_price: number
    trading_symbol: string;
};

type PositionResponse = {
    clients: PositionClient[],
    overall_pnl : number,
    overall_pnl_percentage: number, 
}

type PositionClient = {
    upstoxUserId: string,
    upstoxUsername: string,
    positions: Position[],
    pnl: PositionPnl,
}

type PositionPnl = {
    pnl: number,
    pnl_percentage: number
}

export const getPositionsForUpstoxUser = async (upstoxUser: UpstoxUser) => {
    try {
        const getPositionsUrl : string = `${config.UPSTOX_BASE_URL}/portfolio/short-term-positions`

        const response = await axios.get(getPositionsUrl, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${upstoxUser.accessToken}`
            }
        });

        const positions: Position[] = response.data.data.map((item: any) => ({
            exchange: item.exchange,
            multiplier: item.multiplier,
            value: item.value,
            pnl: item.pnl,
            product: item.product,
            instrument_token: item.instrument_token,
            average_price: item.average_price,
            quantity: item.quantity,
            last_price: item.last_price,
            close_price: item.close_price,
            buy_price: item.buy_price,
            sell_price: item.sell_price,            
            trading_symbol: item.trading_symbol,
            realised: item.realised,
            unrealiesed: item.unrealiesed,
          }));

          return positions;

    } catch(error) {
        console.error('Error in getOrdersForUpstoxUser.', error)
    }
}

export const getAllPositions = async () => {
    const upstoxUsers : UpstoxUser[] = await getAllUpstoxUser();

    let clients = [];
    let overall_pnl = 0;
    let overall_invested = 0;

    for (const upstoxUser of upstoxUsers) {
        let pnl = 0;
        let invested = 0;
        const positions : Position[] = await getPositionsForUpstoxUser(upstoxUser);

        positions.forEach(stock => {
            invested += stock.buy_price * stock.quantity;
            pnl += stock.pnl;
        });

        const client: PositionClient = {
            upstoxUserId: upstoxUser.upstoxUserId,
            upstoxUsername: upstoxUser.username,
            positions: positions,
            pnl: {
                pnl: pnl,
                pnl_percentage: pnl === 0 || invested === 0 ? 0 : pnl / invested * 10,
            }
        }

        overall_pnl += pnl;
        overall_invested += invested;
        
        clients.push(client);  
    }

    const overall_pnl_percentage = overall_invested === 0 || overall_pnl === 0 ? 0 : overall_pnl / (overall_invested) * 100;

    const positionResponse : PositionResponse = {
        clients: clients,
        overall_pnl: overall_pnl,
        overall_pnl_percentage: overall_pnl_percentage
    }

    return positionResponse;
}

interface FundsDetails {
    used_margin: number;
    payin_amount: number;
    span_margin: number;
    adhoc_margin: number;
    notional_cash: number;
    available_margin: number;
    exposure_margin: number;
  }
  
  interface Funds {
    equity: FundsDetails;
    commodity: FundsDetails;
  }

  interface FundsResponse {
    upstoxUserId: string,
    upstoxUsername: string,
    funds: Funds
  }


export const getFundsForUpstoxUser = async(upstoxUser: UpstoxUser) => {
    try {
        const getFundsUrl : string = `${config.UPSTOX_BASE_URL}/user/get-funds-and-margin`

        const response = await axios.get(getFundsUrl, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${upstoxUser.accessToken}`
            }
        });

        const equity: FundsDetails = response.data.data.equity;
        const commodity: FundsDetails = response.data.data.commodity;

        const funds : Funds = {equity:equity, commodity: commodity};

        return funds;

    } catch(error) {
        console.error('Error in getOrdersForUpstoxUser.', error)
    }
}

export const getAllFunds = async() => {
    const upstoxUsers : UpstoxUser[] = await getAllUpstoxUser();

    const fundsResponses : FundsResponse[] = [];

    for (const upstoxUser of upstoxUsers) {
        const funds: Funds = await getFundsForUpstoxUser(upstoxUser);

        const fundsResponse : FundsResponse = {
            upstoxUserId: upstoxUser.upstoxUserId, 
            upstoxUsername: upstoxUser.username,
            funds: funds
        }

        fundsResponses.push(fundsResponse);
    }

    return fundsResponses;
}