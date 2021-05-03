const puppeteer = require('puppeteer');

(async () => {
    const extensionPath = require('path').join(__dirname, 'chrome-extension');
    const extensionName = 'my-extension-name'

    const browser = await puppeteer.launch({
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`
        ],
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://google.com');
    
    // get the background page of the extension
    const targets = await browser.targets();
    const extenstionPageTarget = targets.find(
        (target) => target._targetInfo.title === extensionName
    );
    const extensionPage = await extenstionPageTarget.page();

    // do the zooming by calling setZoom of background.js
    await extensionPage.evaluate(() => {
        // a tabId of undefined defaults to the currently active tab
        let tabId = undefined
        setZoom(tabId, 0.5);
    });
})();
