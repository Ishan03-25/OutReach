import { google } from "googleapis"
import dotenv from "dotenv";
dotenv.config();


export async function getGmailClient(){
    const oauth2Client = new google.auth.OAuth2({
        client_id: process.env.GOOGLE_CLIENT_ID_1,
        client_secret: process.env.GOOGLE_CLIENT_SECRET_1,
    });
    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN_1
    });
    return google.gmail({version: "v1", auth: oauth2Client});
}