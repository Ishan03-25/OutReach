import { chromium } from "playwright";
import {SearchAlumsProfiles} from "../src/linkedin/searchAlumsProfiles";

async function test(){

    const context = await chromium.launchPersistentContext(
        "./linkedin-profile",
        { headless: false }
    );

    const page = await context.newPage();

    const profiles = await SearchAlumsProfiles(page, "Zomato");

    // console.log("Profiles found:", profiles);

}

test();