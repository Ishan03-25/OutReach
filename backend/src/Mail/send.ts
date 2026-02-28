import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getPublicUrl } from "../supaBase/bucket/getUrl";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_EMAIL_1,
    clientId: process.env.GOOGLE_CLIENT_ID_1,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_1,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN_1
  },
});

async function sendMail(attachmentPath: string) {
  try {
    const res = await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL_1,
      to: "ishan03sharma25@gmail.com",
      subject: "nodemailer",
      text: "Hello from Ishan, nodemailer",
      attachments: [
        {
            filename: "Ishan_SDE.pdf",
            path: attachmentPath
        }
      ]
    });
    console.log("Mail sent successfully: ", res);
  } catch (error) {
    console.log("Error sending mail: ", error);
  }
}

export { sendMail };