export interface User {
    user_id: string;
    user_name: string;
}

export interface DecodedToken {
    user_id: string;
    username: string;
    iat: number;
    exp: number;
}

export interface UpstoxUserDetails {
    email: string,
    exchanges: Array<string>,
    products: Array<string>,
    broker: string,
    user_id: string,
    user_name: string,
    order_types: Array<string>,
    user_type: string,
    poa: boolean,
    is_active: boolean
}

export interface AccountDetails {
    upstoxUsername: string;
    upstoxUserId: string;
};

export interface StockData {
    instrument_token: string;
    symbol: string;
    last_price: number;
    net_change: number;
    lower_circuit_limit: number;
    upper_circuit_limit: number;
}

export interface StockResponseData {
    [key: string]: StockData;
}


export interface StockDetails {
    name: string;
    exchange: string;
    price: number;
    change: number;
    instrument_key: string;
    lower_circuit_limit: number;
    upper_circuit_limit: number;
}





