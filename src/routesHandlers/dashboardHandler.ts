import {AccountDetails} from "../types/types";
import {getUpstoxUsersForUser} from "../controllers/userController";


export const getUpstoxAccounts = async (req, res)  => {
    const upstoxUsers = await getUpstoxUsersForUser(req.user.user_id);

    const accountDetails: AccountDetails[] = upstoxUsers.map((upstoxUser) => {
        return {upstoxUsername: upstoxUser.username, upstoxUserId: upstoxUser.upstoxUserId};
    })

    console.log(accountDetails)
    res.json({accountDetails: accountDetails});
}