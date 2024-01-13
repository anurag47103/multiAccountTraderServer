import express, {Router} from 'express';
import {getUpstoxAccounts} from "../routesHandlers/dashboardHandler";

const router: Router = express.Router();

router.get('/getUpstoxAccounts', getUpstoxAccounts);

export default router;