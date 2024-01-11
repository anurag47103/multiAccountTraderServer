import {User, UserDetails} from "../types/types";
import {getUpstoxUserDetails} from "../controllers/upstoxUserController";

export const getUpstoxUser = async (access_token: string) : Promise<User> => {
    const userDetails : UserDetails = await getUpstoxUserDetails(access_token);
    const user : User = {user_id: userDetails.user_id, user_name: userDetails.user_name};
    return user;
}