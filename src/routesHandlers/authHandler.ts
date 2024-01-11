import bcrypt from "bcrypt";
import {createUser, findUserByEmail} from "../controllers/userController";
import jwt from "jsonwebtoken";
import {Request, Response} from "express";
import config from "../config/config";
import axios from "axios";
import {updateAccessToken} from "../services/utilServices";
import {User} from "../types/types";
import {getUpstoxUser} from "../services/UserDetailsUpstox";
import crypto from "crypto";
import {generateToken} from "../controllers/jwtController";

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

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET, // Make sure you have defined this in your environment variables
            {expiresIn: '1h'}
        );

        res.json({token: token, userId: user.id, userName: user.name});
    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({message: 'Error logging in user'});
    }
};

export const authCallbackHandler = async (req: Request, res: Response) => {
    console.log('callback called')
    const { code, state } = req.query;

    if (typeof code !== 'string') {
        return res.status(400).send('Invalid code received.');
    }

    try {
        const params = {
            "code": code,
            "client_id": config.API_KEY,
            "client_secret": config.API_SECRET,
            "redirect_uri": config.REDIRECT_URI,
            "grant_type": "authorization_code",
        };
        console.log(config.API_SECRET)

        const data = `code=${code}&client_id=${config.API_KEY}&client_secret=${config.API_SECRET}&redirect_uri=${config.REDIRECT_URI}&grant_type=authorization_code`;
        console.log(data);

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

        const user : User = await getUpstoxUser(access_token);

        const jwtToken : string = generateToken(user);

        res.cookie('token', jwtToken, {
            httpOnly: true,  // Makes the cookie inaccessible to client-side JavaScript
            secure: true,    // Ensures the cookie is only sent over HTTPS
            sameSite: 'strict' // Helps to mitigate CSRF attacks
        });

        res.redirect(`${config.FRONTEND_URI}/dashboard`);
    } catch (error) {
        console.error('Token exchange failed:', error);
        res.status(500).send('Authentication failed.');
    }
};

export const getAuthUrlHandler = (req: Request, res: Response) => {
    const clientId: string = config.API_KEY;
    const redirectUri: string = config.REDIRECT_URI;
    const responseType: string = 'code';
    const state: string = generateRandomState();

    const authUrl: string = `${config.UPSTOX_BASE_URL}/login/authorization/dialog?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    res.json({ authUrl });
};

const generateRandomState = (): string => {
    return crypto.randomBytes(16).toString('hex');
};