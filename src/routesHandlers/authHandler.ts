import bcrypt from "bcrypt";
import {createUser, findUserByEmail} from "../controllers/userController";
import {Request, Response} from "express";
import config from "../config/config";
import axios, {AxiosResponse} from "axios";
import {UpstoxUserDetails, User} from "../types/types";
import crypto from "crypto";
import {generateToken} from "../controllers/jwtController";
import {addUpstoxUser, addUpstoxUserAccessToken, getAccessTokenFromUpstoxUser, getUpstoxUser, logoutUpstoxUser, removeUpstoxUser} from "../controllers/upstoxUserController";
import UpstoxUser from "../models/UpstoxUser";
import { startWebSocketConnection } from "../controllers/marketFeedController";

export const registerUserHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        console.log('updated register method')
        const newUser = await createUser(name,email, hashedPassword);

        res.status(201).json({ message: 'User created successfully', userId: newUser.id });
    } catch (error) {
        console.error('Error in user registration:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const loginUserHandler = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({message: 'Authentication failed: Email not valid'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Authentication failed: Password not valid'});
        }

        const jwtToken = generateToken(user.id, user.name);

        if(config.NODE_ENV !== 'prod') {
            res.cookie('token', jwtToken, {
                httpOnly: true,
                secure: false, // Not using Secure flag in development
                sameSite: 'lax', // Lax is suitable for development
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
        }

        res.status(200).json({user_id: user.id, username: user.name, token: jwtToken});
    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({message: 'Error logging in user'});
    }
};

export const authCallbackHandler = async (req: Request, res: Response) => {
    const { code, state } = req.query;

    if (typeof code !== 'string') {
        return res.status(400).send('Invalid code received.');
    }

    const [upstoxUserId, userId] = state.toString().split(',');

    
    try {
        const upstoxUser : UpstoxUser = await getUpstoxUser(upstoxUserId);
    
        if(upstoxUser === undefined) {
            return res.status(401).send('upstoxUserId not valid');
        }

        const data: string = `code=${code}&client_id=${upstoxUser.apiKey}&client_secret=${upstoxUser.apiSecret}&redirect_uri=${config.REDIRECT_URI}&grant_type=authorization_code`;

        const response = await axios({
            method: 'post',
            url: 'https://api.upstox.com/v2/login/authorization/token',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        });

        const { access_token } = response.data;

        const upstoxUserDetails : UpstoxUserDetails = response.data;

        await addUpstoxUserAccessToken(access_token, upstoxUserDetails.user_id, upstoxUserDetails.user_name, Number(userId));
        startWebSocketConnection();
        res.status(200).send('successfully logged in');
    } catch (error) {
        console.error('Token exchange failed:', error);
        res.status(500).send('Authentication failed.').redirect('http://localhost:3000/dashboard/accounts');
    }
};


export const getAuthUrlHandler = async (req: Request, res: Response) => {
    const userId : number = req.user.user_id;
    const { upstoxUserId } = req.query;
    
    console.log('getAuthUrlHandler userID: ', userId, upstoxUserId);

    if(!upstoxUserId || typeof upstoxUserId !== 'string') {
        return res.status(401).end('UpstoxUserId missing in getAuthUrl');
    }

    const upstoxUser  = await getUpstoxUser(upstoxUserId);

    if(upstoxUser === undefined) {
        return res.status(401).end('UpstoxUserId not valid');
    }

    const clientId: string = upstoxUser.apiKey;
    const redirectUri: string = config.REDIRECT_URI;
    const responseType: string = 'code';
    const state: string = `${upstoxUserId},${userId}`;

    const authUrl: string = `${config.UPSTOX_BASE_URL}/login/authorization/dialog?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    res.json({ authUrl });
};

export const logoutUpstoxAccountHandler = async(req: Request, res: Response) => {

    try {
        const logoutUrl: string = `${config.UPSTOX_BASE_URL}/logout`;

        const { upstoxUserId } = req.body;

        if (typeof upstoxUserId !== 'string') {
            console.error('Invalid UpstoxUserId in logout request');
            return res.status(400).send('Invalid UpstoxUserId');
        }

        const upstoxUser: UpstoxUser = await getUpstoxUser(upstoxUserId);

        const access_token: string = upstoxUser.accessToken;

        const response = await axios.delete(logoutUrl, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });

        const isLoggedOut = logoutUpstoxUser(upstoxUserId);

        console.log('logout response', response.data)
        res.status(200).json(response.data);
    } catch(error) {
        console.error('Error in logging out Upstox User', error);
        res.status(500).json(error);
    }
}