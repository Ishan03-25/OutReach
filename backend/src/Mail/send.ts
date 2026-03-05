import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getPublicUrl } from "../supaBase/bucket/getUrl";
dotenv.config();

console.log("Environment variables loaded: ", {
  GOOGLE_EMAIL_1: process.env.GOOGLE_EMAIL_1,
  GOOGLE_CLIENT_ID_1: process.env.GOOGLE_CLIENT_ID_1,
  GOOGLE_CLIENT_SECRET_1: process.env.GOOGLE_CLIENT_SECRET_1,
  GOOGLE_REFRESH_TOKEN_1: process.env.GOOGLE_REFRESH_TOKEN_1,
});

// const transporter = nodemailer.createTransport({
//   service: "gmail", 
//   auth: {
//     type: "OAuth2",
//     user: process.env.GOOGLE_EMAIL_1,
//     clientId: process.env.GOOGLE_CLIENT_ID_1,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET_1,
//     refreshToken: process.env.GOOGLE_REFRESH_TOKEN_1
//   },
// });

const createtransporter = (email: string, refreshToken: string) => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: email,
      clientId: process.env.GOOGLE_CLIENT_ID_1,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_1,
      refreshToken: refreshToken
    },
  })
}

async function sendMail(attachmentPath: string, from: string, to: string, refreshToken: string) {
  try {
    const transporter = createtransporter(from, refreshToken);
    const res = await transporter.sendMail({
      from: from,
      to: to,
      subject: "nodemailer",
      text: `Hello, testing nodemailer from email id ${from} to email id ${to}`,
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