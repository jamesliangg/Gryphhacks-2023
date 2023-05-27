import puppeteer from "puppeteer";

export async function scrapeLinks(website) {
    const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox'],});
    const page = await browser.newPage();
    await page.goto(website);
    // await page.screenshot({ path: "website.png", fullPage: true });
    const findLinks = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a")).map((info) => ({
            information: info.href.split()
        }))
    );
    let links = [];
    findLinks.forEach((link) => {
        if (link.information.length) {
            links.push(link.information);
        }
    });
    // await console.log(links);
    await page.close();
    await browser.close();
    return links;
}

export async function scrapeWebsite(website, classSelector) {
    const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox'],});
    const page = await browser.newPage();
    await page.goto(website);
    // page.waitForSelector(classSelector).then(() => console.log("Selector loaded"));
    // await page.screenshot({ path: "website.png", fullPage: true });
    let reviews = await page.evaluate((classSelector) => {
        return Array.from(document.querySelectorAll(classSelector)).map(x => x.textContent)
    }, classSelector);
    await browser.close();
    return reviews;
}