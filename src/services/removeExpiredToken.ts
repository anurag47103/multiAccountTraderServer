import cron from 'node-cron';
import UpstoxUser from "../models/UpstoxUser"; // Replace with the actual import path

export function setupCronJob() {
    cron.schedule('30 3 * * *', async () => {
        try {
            await UpstoxUser.update(
                { accessToken: null, isLoggedIn: false }, 
                { where: {} } 
            );
            console.log('All UpstoxUser tokens reset');
        } catch (error) {
            console.error('Error in resetting UpstoxUser tokens:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" 
    });
}
