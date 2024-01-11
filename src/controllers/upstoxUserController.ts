import {UserDetails} from "../types/types";
import axios, {AxiosResponse} from "axios";
import config from "../config/config";

export const getUpstoxUserDetails = async (access_token:string): Promise<UserDetails> => {
    const response : AxiosResponse<UserDetails> = await axios({
        method: 'get',
        url: 'https://api.upstox.com/v2/user/profile',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${access_token}`
        },
    });
    console.log('userData: ', response.data);
    return response.data;
}