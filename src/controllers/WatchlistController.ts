import Watchlist from "../models/Watchlist";

export async function addToWatchlist(instrumentKey: string, userId: number): Promise<boolean> {
    try {
        console.log('userId in addtowatchlist:', userId);
        const newItem = await Watchlist.create({ user_id: userId, instrument_key: instrumentKey });
        return true;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Item already in watchlist');
        }
        console.error('Error adding to watchlist:', error);
        return false;
    }
}

export async function removeFromWatchlist(instrumentKey: string, userId: number): Promise<boolean> {
    try {
        await Watchlist.destroy({ where: { user_id : userId, instrument_key: instrumentKey } });
        console.log('Item removed from watchlist');
        return true;
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        return false;
    }
}

export async function getAllWatchlist() {
    try {
        const response : Watchlist[] = await Watchlist.findAll();
        return response;
    } catch(error) {
        console.error("Error in fetching all the Watchlist", error);
    }
}

export async function getWatchlistForUser(userId: number) {
    try {
        const response: Watchlist[] = await Watchlist.findAll({
            where: {user_id: userId}
        });
        return response;
    } catch (error) {
        console.error('Error in getting Watchlist for user', error);
    }
}
