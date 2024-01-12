import {UpstoxUserDetails} from "../types/types";
import axios, {AxiosResponse} from "axios";
import {findUserById} from "./userController";
import User from "../models/User";

export const getUpstoxUserDetails = async (access_token:string): Promise<UpstoxUserDetails> => {
    const response : AxiosResponse<UpstoxUserDetails> = await axios({
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
export const addUpstoxUser = async(access_token: string, upstoxUser: UpstoxUserDetails, user_id: number)=> {
    try {
        const user : User = await findUserById(user_id);
        await user.addUpstoxUser({upstoxUserId:upstoxUser.user_id, username: upstoxUser.user_name, accessToken: access_token});
        console.log('added upstox user successfully')
    } catch (error) {
        console.error('Could not add UpstoxUser: ', error);
    }

}
