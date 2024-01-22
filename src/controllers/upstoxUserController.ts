import {UpstoxUserDetails} from "../types/types";
import axios, {AxiosResponse} from "axios";
import {findUserById} from "./userController";
import User from "../models/User";
import config from "../config/config";
import UpstoxUser from "../models/UpstoxUser";

export const getUpstoxUserDetails = async (access_token:string): Promise<UpstoxUserDetails> => {
    const response : AxiosResponse<UpstoxUserDetails> = await axios({
        method: 'get',
        url: `${config.UPSTOX_BASE_URL}/user/profile`,
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

        console.log('user: ', user);

        await user.addUpstoxUser({upstoxUserId:upstoxUser.user_id, username: upstoxUser.user_name, accessToken: access_token});

        console.log('Added upstox user successfully')
    } catch (error) {
        console.error('Could not add UpstoxUser: ', error);
    }

}

export const removeUpstoxUser = async( upstoxUserId: string) => {
    try{
        const response : number = await UpstoxUser.destroy({
            where: {upstoxUserId: upstoxUserId}
        })
        if(response>0) return true;
        else return false;
    } catch(error) {
        console.error('Error in removing UpstoxUser : ', error);
        return false;
    }
}

export const getUpstoxUser = async(upstoxUserId: string) : Promise<UpstoxUser | undefined> => {
    try {
        const upstoxUser : UpstoxUser = await UpstoxUser.findOne({
            where: {upstoxUserId: upstoxUserId}
        })
        return upstoxUser ?? undefined;
    } catch(error) {
        console.error('Error in finding Upstox User with upstoxUserId', error.error);
        return undefined;
    }
}

export const getAccessTokenFromUpstoxUser = async() : Promise<string | undefined> => {
    try {
        const upstoxUser : UpstoxUser = await UpstoxUser.findOne();

        if(upstoxUser) {
            return upstoxUser.accessToken;
        }
        else {
            console.error("Error in getting access token as no Upstox User is logged In");
            return undefined;
        }
    } catch (error) {
        console.error("Error in runing UpstoxUser.findOne()")
        return undefined;
    }
}

