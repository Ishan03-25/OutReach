import { GoogleApis } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export async function getGoogleSheetsClient() {
    const google = new GoogleApis();
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    return google.sheets({ version: "v4", auth });
}   