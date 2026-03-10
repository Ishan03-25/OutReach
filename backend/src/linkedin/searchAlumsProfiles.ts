export async function SearchAlumsProfiles(page: any, company: string) {
    const roles=[
    "Software Engineer",
    // "Data Scientist",
    // "Software Developer",
    // "Data Analyst",
    // "Machine Learning Engineer",
    // "AI Engineer",
    // "Backend Developer",
    // "Frontend Developer",
    // "Full Stack Developer",
    ]
    let allProfiles: {"role": string, "profiles": string[]}[] = []
    for (const role of roles){
        await page.goto("https://www.linkedin.com/search/results/people/?keywords=" + company + " " +role + "%20IIT%20Kharagpur",);
        await page.waitForTimeout(5000 + Math.random() * 5000);
        const profiles: string[] = await page.$$eval(
            'a[href*="/in/"]',
            (links: HTMLAnchorElement[]) => links.map((l: HTMLAnchorElement) => l.href)
        )
        const uniqueProfiles = [...new Set(profiles)].filter(url => url.startsWith("https://www.linkedin.com/in/")).filter(url=> !url.includes('?')) as string[];
        console.log("Unique Profiles for role:", role, " are :", uniqueProfiles);
        allProfiles.push({ role: role, profiles: uniqueProfiles });
    }
    return allProfiles;
}
