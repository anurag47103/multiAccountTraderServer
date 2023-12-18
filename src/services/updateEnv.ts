import fs from 'fs';
import path from 'path';

const ENV_PATH = path.join(__dirname, '/../../.env');

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
