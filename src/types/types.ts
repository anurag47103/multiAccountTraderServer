export interface User {
    user_id: string;
    user_name: string;
}

export interface DecodedToken {
    id: string;
    username: string;
    iat: number;
    exp: number;
}

export interface UserDetails {
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