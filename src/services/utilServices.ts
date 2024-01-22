import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import Watchlist from "../models/Watchlist";
import {getAllWatchlist} from "../controllers/WatchlistController";

const ENV_PATH = path.join(__dirname, '/../../.env');

export let stockData = [];

export function updateAccessToken(accessToken: string): void {
    let envContent = fs.readFileSync(ENV_PATH, 'utf8');

    const regex = /^ACCESS_TOKEN=.*$/m;
    if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `ACCESS_TOKEN=${accessToken}`);
    } else {
        envContent += `\nACCESS_TOKEN=${accessToken}\n`;
    }

    fs.writeFileSync(ENV_PATH, envContent);
    console.log('Access token updated in .env');
}

const convertCsvToJson : () => Promise<any[]> = () => {
    const filePath = '/Users/anurag/files/myStockBroker/backend-server/src/data/NSE-6.csv'
    return new Promise((resolve, reject) => {
        const results: any[] = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const { instrument_key, name, last_price, exchange } = row;
                results.push({ instrument_key, name, last_price, exchange});
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

export const getStockData = async () => {
    if(stockData === null || stockData.length === 0) {
        stockData  = await convertCsvToJson();
    }

    return stockData;
}

export const getAllInstrumentKeys = async (): Promise<string[]> => {
    const watchlist : Watchlist[] = await getAllWatchlist();
    if(!watchlist || watchlist.length == 0) {
        return [];
    }

    const instrumentKeysArray : string[] = watchlist.map(watchlist => {
        return watchlist.instrument_key;
    })

    return instrumentKeysArray;
}

