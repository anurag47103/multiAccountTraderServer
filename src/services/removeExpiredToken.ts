import cron from 'node-cron';
import UpstoxUser from "../models/UpstoxUser"; // Replace with the actual import path

export function setupCronJob() {
    cron.schedule('30 3 * * *', async () => {
        try {
            await UpstoxUser.destroy({
                where: {},
                truncate: true // Efficiently delete all rows
            });
            console.log('All expired tokens removed');
        } catch (error) {
            console.error('Error in removing expired tokens:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Timezone for Bengaluru, India
    });
}
