export async function SearchAlumsProfiles(page: any, company: string) {
  await page.goto(
    "https://www.linkedin.com/search/results/people/?keywords=" +
      company +
      "%20IIT%20Kharagpur",
  );
  // await page.waitForTimeout(60000)
  const profiles = await page.$$eval(
    'a[href*="/in/"]',
    (links: HTMLAnchorElement[]) => links.map((l: HTMLAnchorElement) => l.href),
  );
  const uniqueProfiles = [...new Set(profiles)];
  console.log("Unique Profiles:", uniqueProfiles);
  for (const profile of uniqueProfiles) {
    console.log("Visiting profile:", profile);

    await page.goto(profile, { waitUntil: "domcontentloaded" });

    // Wait for profile header
    await page.waitForSelector("h1", { timeout: 10000 });

    const data = await page.evaluate(() => {
      const name =
        document.querySelector("h1")?.textContent?.trim() || "Name not found";

      const role =
        document
          .querySelector("h1")
          ?.parentElement?.querySelector("p")
          ?.textContent?.trim() || "Role not found";

      return { name, role };
    });

    console.log("Profile:", data);

    await page.waitForTimeout(3000 + Math.random() * 3000);
  }
}
