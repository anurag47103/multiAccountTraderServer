import UpstoxUser from "../models/UpstoxUser";

// export const getUpstoxUserDetails = async (access_token:string) => {
    // const response : AxiosResponse<UpstoxUserDetails> = await axios({
    //     method: 'get',
    //     url: `${config.UPSTOX_BASE_URL}/user/profile`,
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Authorization': `Bearer ${access_token}`
    //     },
    // });
    // console.log('userData: ', response.data);

//     const upstoxUsers: AccountDetails[] = await UpstoxUser.findAll({
//         attributes: ['username', 'upstoxUserId', 'isLoggedIn']
//     });
//     return upstoxUsers;
// }
export const getAllUpstoxUser = async () => {
    try {
        const upstoxUsers : UpstoxUser[] = await UpstoxUser.findAll();
        return upstoxUsers;
    } catch(error) {
        console.error('Error in getting all upstox user');
    }
}
export const addUpstoxUserAccessToken = async (access_token: string, upstoxUserId: string, upstoxUserName: string, user_id: number) => {
    try {
        const upstoxUser = await UpstoxUser.findOne({
            where: {
                user_id: user_id, 
                upstoxUserId: upstoxUserId
            }
        });

        if (upstoxUser) {
            upstoxUser.accessToken = access_token;
            upstoxUser.isLoggedIn = true;
            upstoxUser.username = upstoxUserName;
            await upstoxUser.save();
        } else {
            console.error(`UpstoxUser not found, upstoxUserId: ${upstoxUserId} and user_id: ${user_id}`);
        }

    } catch (error) {
        console.error('Could not add UpstoxUser access token: ', error);
    }
}

export const logoutUpstoxUser = async (upstoxUserId: string) => {
    try {
        const upstoxUser = await getUpstoxUser(upstoxUserId);

        if(upstoxUser) {
            upstoxUser.accessToken = null;
            upstoxUser.isLoggedIn = false;
            await upstoxUser.save();
            console.log(`User with UpstoxUserId ${upstoxUserId} logged out successfully.`);
        } 
        else {
            console.log(`User with UpstoxUserId ${upstoxUserId} not found.`);
        }
    } catch (error) {
        console.error('Error logging out user:', error);
    }
};


export const removeUpstoxUser = async (upstoxUserId: string) => {
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

export const addUpstoxUser = async (user_id: number, apiKey: string, apiSecret: string, name: string, upstoxId: string) => {
    try {
        const newUpstoxUser = await UpstoxUser.create({
            user_id,
            apiKey,
            apiSecret,
            username: name,
            isLoggedIn: false,
            upstoxUserId: upstoxId,
        });
        
        console.log('UpstoxUser added successfully:', newUpstoxUser);
        return newUpstoxUser;
    } catch(error) {
        console.error('UpstoxUser added successfully:', error);
    }
}

