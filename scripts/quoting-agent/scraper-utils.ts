/**
 * COMMON SCRAPING PATTERNS
 */
import { Builder, By, until, WebDriver } from "npm:selenium-webdriver";
import chrome from "npm:selenium-webdriver/chrome.js";

export async function createDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  options.addArguments("--headless");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

export async function clickElement(driver: WebDriver, selector: string) {
  console.log(`LOG: Clicking element: ${selector}`);
  const el = await driver.wait(until.elementLocated(By.css(selector)), 15000);
  await driver.wait(until.elementIsVisible(el), 15000);
  await el.click();
}

export async function typeInElement(
  driver: WebDriver,
  selector: string,
  text: string,
) {
  console.log(`LOG: Typing "${text}" in element: ${selector}`);
  const el = await driver.wait(until.elementLocated(By.css(selector)), 15000);
  await el.sendKeys(text);
}

export async function waitForUrlPattern(
  driver: WebDriver,
  pattern: string,
  maxRetries = 15,
) {
  console.log(`LOG: Waiting for URL to match pattern: ${pattern}`);
  for (let i = 0; i < maxRetries; i++) {
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes(pattern)) return true;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

export async function findAndClickLinkByHref(
  driver: WebDriver,
  pattern: string,
) {
  console.log(`LOG: Finding and clicking link with href pattern: ${pattern}`);
  const el = await driver.wait(
    until.elementLocated(By.css(`a[href*="${pattern}"]`)),
    15000,
  );
  await el.click();
}
