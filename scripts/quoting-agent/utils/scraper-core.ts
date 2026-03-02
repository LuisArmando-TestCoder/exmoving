import {
  Builder,
  By,
  until,
  WebDriver,
  WebElement,
} from "npm:selenium-webdriver";
import chrome from "npm:selenium-webdriver/chrome.js";
import { logPerformance, logPipeline, verbose } from "./logger.ts";

export async function createDriver(): Promise<WebDriver> {
  const start = Date.now();
  verbose("SCRAPER-UTILS", "Creating Selenium Driver...");
  const options = new chrome.Options();
  options.addArguments("--headless");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  logPerformance("Driver Creation", Date.now() - start);
  return driver;
}

export async function clickElement(driver: WebDriver, selector: string) {
  const start = Date.now();
  logPipeline(`Click Element: ${selector}`, "START");
  try {
    const el = await driver.wait(until.elementLocated(By.css(selector)), 15000);
    await driver.wait(until.elementIsVisible(el), 15000);

    // Check for blockers and wait for them to disappear
    await driver.wait(async () => {
      const blockers = await driver.findElements(By.css(".loadingDiv"));
      if (blockers.length === 0) return true;
      const visible = await Promise.all(blockers.map((b: any) => b.isDisplayed()));
      return !visible.some((v: any) => v === true);
    }, 15000);

    // Try direct click first, then script click as backup
    try {
      await el.click();
    } catch (e) {
      verbose(
        "SCRAPER-UTILS",
        `Click intercepted for ${selector}, using script click.`,
      );
      await driver.executeScript("arguments[0].scrollIntoView();", el);
      await driver.executeScript("arguments[0].click();", el);
    }

    logPipeline(`Click Element: ${selector}`, "SUCCESS");
    logPerformance(`Click: ${selector}`, Date.now() - start);
  } catch (err) {
    logPipeline(`Click Element: ${selector}`, "ERROR", (err as Error).message);
    throw err;
  }
}

export async function typeInElement(
  driver: WebDriver,
  selector: string,
  text: string,
) {
  const start = Date.now();
  logPipeline(`Type text in: ${selector}`, "START");
  try {
    const el = await driver.wait(until.elementLocated(By.css(selector)), 15000);
    await el.sendKeys(text);
    logPipeline(`Type text in: ${selector}`, "SUCCESS");
    logPerformance(`Type: ${selector}`, Date.now() - start);
  } catch (err) {
    logPipeline(`Type text in: ${selector}`, "ERROR", (err as Error).message);
    throw err;
  }
}

export async function waitForUrlPattern(
  driver: WebDriver,
  pattern: string,
  maxRetries = 15,
) {
  const start = Date.now();
  logPipeline(`Wait for URL: ${pattern}`, "START");
  for (let i = 0; i < maxRetries; i++) {
    try {
      const currentUrl = await driver.getCurrentUrl();
      verbose(
        "SCRAPER-UTILS",
        `Checking URL: ${currentUrl} (Pattern: ${pattern})`,
      );
      if (currentUrl.includes(pattern)) {
        logPipeline(`Wait for URL: ${pattern}`, "SUCCESS", {
          finalUrl: currentUrl,
        });
        logPerformance(`URL Wait: ${pattern}`, Date.now() - start);
        return true;
      }
    } catch (e) {
      verbose("SCRAPER-UTILS", "Browser connection lost or busy...");
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  logPipeline(
    `Wait for URL: ${pattern}`,
    "ERROR",
    "Timeout waiting for pattern",
  );
  return false;
}

export async function findAndClickLinkByHref(
  driver: WebDriver,
  pattern: string,
) {
  const start = Date.now();
  logPipeline(`Click Link By Href: ${pattern}`, "START");
  try {
    const el = await driver.wait(
      until.elementLocated(By.css(`a[href*="${pattern}"]`)),
      15000,
    );
    await driver.executeScript("arguments[0].scrollIntoView();", el);
    await driver.executeScript("arguments[0].click();", el);
    logPipeline(`Click Link By Href: ${pattern}`, "SUCCESS");
    logPerformance(`Href Click: ${pattern}`, Date.now() - start);
  } catch (err) {
    logPipeline(`Click Link By Href: ${pattern}`, "ERROR", (err as Error).message);
    throw err;
  }
}

export async function dismissAlertIfPresent(driver: WebDriver) {
  try {
    const alert = await driver.switchTo().alert();
    const text = await alert.getText();
    verbose("SCRAPER-UTILS", `Closing alert: ${text}`);
    await alert.accept();
    return text;
  } catch (e) {
    // No alert present
    return null;
  }
}
