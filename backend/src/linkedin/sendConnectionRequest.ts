import { Page } from "@playwright/test";

export async function sendConnectionRequest(page: Page, profileUrl: string): Promise<boolean> {
  try {
    console.log(`Navigating to profile: ${profileUrl}`);
    await page.goto(profileUrl, { waitUntil: "domcontentloaded" });
    
    // Wait for the page to fully render
    await page.waitForTimeout(3000); 

    // 1. Click the "Connect" button
    const clickedConnect = await page.evaluate(() => {
      const connectButton = [...document.querySelectorAll<HTMLElement>("button, a")].find(el =>
        el.innerText.trim().toLowerCase() === "connect" || 
        el.getAttribute("aria-label")?.toLowerCase().includes("invite")
      );

      if (connectButton) {
        connectButton.click();
        return true; // Return true so Playwright knows it succeeded
      }
      return false;
    });

    if (!clickedConnect) {
      console.log("Connect button not found on the profile page.");
      return false; // Exit early if we couldn't click connect
    } else {
      console.log("Connect button clicked. Waiting for modal...");
    }

    // Give the modal time to pop up and attach its Shadow DOM
    await page.waitForTimeout(5000); 

    // 2. Click the "Add a note" button inside the Shadow DOM
    await page.evaluate(() => {
      const shadowHost = document.querySelector('#interop-outlet');

      if (shadowHost && shadowHost.shadowRoot) {
        // Look inside the shadowRoot specifically
        const addNoteBtn = shadowHost.shadowRoot.querySelector<HTMLElement>('button[aria-label="Add a note"]');
        
        if (addNoteBtn) {
          addNoteBtn.click();
          console.log("Add a note button clicked!");
        } else {
          console.log("Add a note button not found inside Shadow Root.");
        }
      } else {
        console.log("Shadow Host (#interop-outlet) not found. Modal might not be open.");
      }
    });

    return true;
  } catch (error) {
    console.error(`Error sending connection request to ${profileUrl}:`, error);
    return false;
  }
}