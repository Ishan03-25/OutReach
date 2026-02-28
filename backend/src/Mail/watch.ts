import { getGmailClient } from "./client";

export async function startWatchGmail(){
    const gmail = await getGmailClient();
    const res = await gmail.users.watch({
        userId: "me",
        requestBody: {
            topicName: `projects/${process.env.GCP_PROJECT_ID}/topics/gmail-notify`,
            labelIds: ["INBOX"]
        }
    });
    console.log("Gmail Watch activated");
    console.log("Response of gmail watch: ", res);
}

try {
  startWatchGmail();
} catch (error) {
  console.log("Error in starting gmail watch: ", error);
}