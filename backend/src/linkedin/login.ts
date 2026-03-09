import { chromium } from "@playwright/test";

// export async function LinkedinLogin(){
//     const browser = await chromium.launch({
//         headless: false
//     })
//     const page = await browser.newPage();
//     const context = await browser.newContext();
//     await page.goto("https://www.linkedin.com/login");
//     await page.getByLabel("Email or phone").fill("ishansharma9s8a5s8a9m1@gmail.com");
//     await page.getByLabel("Password").fill("Ishan03@linkedin");
//     await page.click('button[type="submit"]');
//     await page.waitForURL("https://www.linkedin.com/feed/");
//     console.log("Login successful, storing session...");
//     await context.storageState({ path: "linkedinSession.json" });
//     console.log("Session saved to linkedinSession.json");
//     await browser.close();
// }

// async function login() {

//   const context = await chromium.launchPersistentContext(
//     "./linkedin-profile",
//     {
//       headless: false
//     }
//   );

//   const page = await context.newPage();

//   await page.goto("https://www.linkedin.com/login");

//   console.log("Login manually in the browser");

//   await page.waitForTimeout(60000);

// }

// login();

// LinkedinLogin();

// import { chromium } from "playwright";

async function loginCheck() {
  const context = await chromium.launchPersistentContext("./linkedin-profile", {
    headless: false,
  });

  const page = await context.newPage();

  await page.goto("https://www.linkedin.com/feed/");
}

loginCheck();
