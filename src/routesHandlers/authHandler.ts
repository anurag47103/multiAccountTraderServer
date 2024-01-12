import bcrypt from "bcrypt";
import {createUser, findUserByEmail} from "../controllers/userController";
import {Request, Response} from "express";
import config from "../config/config";
import axios from "axios";
import {updateAccessToken} from "../services/utilServices";
import {UpstoxUserDetails, User} from "../types/types";
import crypto from "crypto";
import {generateToken} from "../controllers/jwtController";
import {addUpstoxUser} from "../controllers/upstoxUserController";

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
            maxAge: 2 * 60 * 60 * 1000 //2h
        });

        res.json({message: "logged in "});
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
        const data = `code=${code}&client_id=${config.API_KEY}&client_secret=${config.API_SECRET}&redirect_uri=${config.REDIRECT_URI}&grant_type=authorization_code`;

        const response = await axios({
            method: 'post',
            url: 'https://api.upstox.com/v2/login/authorization/token',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        });

        let tempState = state.toString();
        console.log('tempSate: ' , tempState)
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