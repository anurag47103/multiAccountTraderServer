import bcrypt from "bcrypt";
import {createUser, findUserByEmail} from "../controllers/userController";
import {Request, Response} from "express";
import config from "../config/config";
import axios, {AxiosResponse} from "axios";
import {updateAccessToken} from "../services/utilServices";
import {UpstoxUserDetails, User} from "../types/types";
import crypto from "crypto";
import {generateToken} from "../controllers/jwtController";
import {addUpstoxUser, getUpstoxUser, removeUpstoxUser} from "../controllers/upstoxUserController";
import UpstoxUser from "../models/UpstoxUser";

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

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24  * 60 * 60 * 1000 //24h
        });

        res.json({user_id: user.id, username: user.name});
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

    try {
        const data: string = `code=${code}&client_id=${config.API_KEY}&client_secret=${config.API_SECRET}&redirect_uri=${config.REDIRECT_URI}&grant_type=authorization_code`;

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

        updateAccessToken(access_token);

        const userId = Number(state);
        const upstoxUser : UpstoxUserDetails = response.data;

        addUpstoxUser(access_token, upstoxUser, userId);

        res.redirect(`${config.FRONTEND_URI}/dashboard`);
    } catch (error) {
        console.error('Token exchange failed:', error);
        res.status(500).send('Authentication failed.');
    }
};

export const logoutUpstoxAccountHandler = async(req: Request, res: Response) => {

    try {
        const logoutUrl: string = `${config.UPSTOX_BASE_URL}/logout`;

        const upstoxUserId = req.query.upstoxUserId;

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

        const isRemoved = removeUpstoxUser(upstoxUserId);

        console.log('logout response', response.data)
        res.status(200).json(response.data);
    } catch(error) {
        console.error('Error in logging out Upstox User', error);
        res.status(500).json(error);
    }
}

export const getAuthUrlHandler = (req: Request, res: Response) => {
    const userId : string = req.user.user_id;
    console.log('getAuthUrlHandler userID: ', userId);

    const clientId: string = config.API_KEY;
    const redirectUri: string = config.REDIRECT_URI;
    const responseType: string = 'code';
    const state: string = userId;

    const authUrl: string = `${config.UPSTOX_BASE_URL}/login/authorization/dialog?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    res.json({ authUrl });
};