import { chromium } from "playwright";
import { sendConnectionRequest } from "../src/linkedin/sendConnectionRequest";
import { SearchAlumsProfiles } from "../src/linkedin/searchAlumsProfiles";

async function test() {
    const context = await chromium.launchPersistentContext(
        "./linkedin-profile",
        { headless: false }
    );

    const page = await context.newPage();

    // Get profiles using SearchAlumsProfiles
    const allProfiles = await SearchAlumsProfiles(page, "Netflix");

    // Iterate through each role's profiles and send connection requests
    for (const roleData of allProfiles) {
        console.log(`Processing role: ${roleData.role}`);
        for (const profileUrl of roleData.profiles) {
            console.log(`Sending connection request to: ${profileUrl}`);
            const result = await sendConnectionRequest(page, profileUrl);
            if (result) {
                console.log(`Successfully sent connection request to: ${profileUrl}`);
            }
            // Add delay between requests to avoid rate limiting
            await page.waitForTimeout(2000 + Math.random() * 3000);
        }
    }

    await context.close();
}

test();
