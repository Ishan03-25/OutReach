// import { sendMail } from "./Mail/send";
// import { getPublicUrl } from "./supaBase/bucket/getUrl";

// const filePath = process.env.SUPABASE_FILE_PATH;
// if (!filePath){
//   throw new Error("File path not found in environment variables");
// }
// const cvUrl = getPublicUrl(filePath);

// try {
//   sendMail(cvUrl)
// } catch (error) {
//   console.error("Error in Sending Mail:", error);
// }

import express from "express";
import { getGmailClient } from "./Mail/client";
import axios from "axios";
import nodeCron from "node-cron";
import dotenv from "dotenv";
import { getPublicUrl } from "./supaBase/bucket/getUrl";
import { sendMail } from "./Mail/send";
import { getGoogleSheetsClient } from "./sheets/outreachSheet";
dotenv.config();
// import { startWatchGmail } from './Mail/watch';

const app = express();
const port = 3000;

app.use(express.json());

nodeCron.schedule("0 31 03 * * 1-5", async () => {
  const filePath = process.env.SUPABASE_FILE_PATH;
  if (!filePath) {
    throw new Error("File path not found in environment variables");
  }
  const cvurl = getPublicUrl(filePath);
  try {
    let emails_from: {email: string, refreshToken: string}[] = [];
    for (let i = 1; i <= 5; i++) {
      const email: string | undefined = process.env[`GOOGLE_EMAIL_${i}`];
      const refreshToken: string | undefined = process.env[`GOOGLE_REFRESH_TOKEN_${i}`];
      if (!email) {
        console.log(
          `GOOGLE_EMAIL_${i} not found in environment variables in emails from loop`,
        );
        continue;
      }
      if (!refreshToken){
        console.log(
          `GOOGLE_REFRESH_TOKEN_${i} not found in environment variables in emails from loop`,
        );
        continue;
      }
      emails_from.push({email, refreshToken});
    }
    console.log("Emails from which mails will be sent: ", emails_from);
    const sheet = await getGoogleSheetsClient();
    if (!process.env.GOOGLE_SPREADSHEET_ID) {
      throw new Error("Google Spreadsheet ID not found in environment variables");
    }
    const res = await sheet.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "Leads!A2:F"
    })
    const rows = res.data.values;
    if (!rows) console.log("No data found in spreadsheet");
    console.log("Data from spreadsheet: ", rows);
    for (let i = 0; i < emails_from.length; i++) {
      let emails_to: {email: string, rowIndex: number}[] = (rows ?? []).filter(row => row[4] === "false").map((row, index) => ({email: row[1], rowIndex: index + 2}));
      console.log("Emails to which mails will be sent: ", emails_to);
      for (let j = 0; j < ((emails_to.length>10) ? 10 : emails_to.length); j++) {
        if (!emails_from[i].email) {
          console.log(
            `GOOGLE_EMAIL_${i + 1} not found in environment variables in emails_from nested loops`,
          );
          continue;
        }
        if (!emails_from[i].refreshToken){
          console.log(
            `GOOGLE_REFRESH_TOKEN_${j + 1} not found in environment variables in emails_from nested loops`,
          );
          continue;
        }
        if (!emails_to[j]){
          console.log(`Email to ${j+1} not found in google sheet data, skipping this email`);
          continue;
        }
        try {
          const res = await sendMail(cvurl, emails_from[i].email, emails_to[j].email, emails_from[i].refreshToken);
          console.log(
            `Scheduled mail sent successfully from ${emails_from[i].email} to ${emails_to[j].email}`,
          );
          const updateStatus = await sheet.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
            range: `Leads!E${emails_to[j].rowIndex}`,
            valueInputOption: "RAW",
            requestBody: {
              values: [["true"]]
            }
          })
          console.log(`Spreadsheet updated successfully for email ${emails_to[j].email} with response: `, updateStatus.data);
        } catch (error) {
          console.log(
            `Error in sending scheduled mail from ${emails_from[i].email} to ${emails_to[j].email}: `,
            error,
          );
        }
      }
    }
    console.log("Scheduled mail sent successfully");
  } catch (error) {
    console.log("Error in sending scheduled mail: ", error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.post("/gmail/webhook", (req, res)=>{
//   try {
//     console.log("Gmail notification received");
//     const pubSubMessage = req.body.message;
//     const decodedData = JSON.parse(Buffer.from(pubSubMessage.data, "base64").toString());
//     console.log("Notification: ", decodedData);

//   } catch (error) {
//     console.log("Error in Gmail Webhook:", error);
//     res.sendStatus(500);
//   }
// })

let lastHistoryId: string | null = null;

app.post("/gmail/webhook", async (req, res) => {
  try {
    const message = req.body.message;
    const decoded = JSON.parse(Buffer.from(message.data, "base64").toString());
    const gmail = await getGmailClient();
    if (!lastHistoryId) {
      lastHistoryId = decoded.historyId;
      console.log("Initial history id set: ", lastHistoryId);
      return res.sendStatus(200);
    }
    const history = await gmail.users.history.list({
      userId: "me",
      startHistoryId: lastHistoryId,
    });
    const changes = history.data.history || [];
    for (const change of changes) {
      if (!change.messagesAdded) continue;
      for (const msg of change.messagesAdded) {
        if (!msg.message?.id) continue;
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.message?.id,
        });
        const labels = email.data.labelIds || [];
        const isIncoming = labels.includes("INBOX") && !labels.includes("SENT");
        if (!isIncoming) continue;
        const from =
          email.data.payload?.headers?.find((h) => h.name === "From")?.value ||
          "";
        if (from.includes(process.env.GOOGLE_EMAIL_1!)) continue;
        try {
          const res = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: process.env.WHATSAPP_USER_PHONE_NUMBER,
              type: "text",
              text: {
                preview_url: false,
                body: `Hi Ishan, you have a new email from ${from} with subject: ${email.data.payload?.headers?.find((h) => h.name === "subject")?.value || "No Subject"}. Snippet: ${email.data.snippet}`,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
              },
            },
          );
          console.log("whatsapp alert sent successfully: ", res);
        } catch (error) {
          console.log("Error in sedning whatsapp alert of new mail: ", error);
        }
        console.log("New email recieved: ", email.data.snippet);
      }
    }
    lastHistoryId = decoded.historyId;
    return res.sendStatus(200);
  } catch (error) {
    console.log("error in gmail webhook: ", error);
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
