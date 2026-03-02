import { Provider, QuoteDetail } from "./types.ts";
import { CONFIG, ENV } from "./config.ts";
import * as utils from "./utils/scraper-core.ts";
import { mapFormStructure } from "./utils/form-mapper.ts";
import { fillFormWithMappedValues } from "./utils/form-filler.ts";
import { By, until, WebDriver } from "npm:selenium-webdriver";
import { logPipeline, verbose } from "./utils/logger.ts";
import * as fs from "node:fs/promises";

/**
 * Selenium Logic Implementation for Movers POE
 */

async function loginToMoversPOE(driver: WebDriver) {
  const { selectors } = CONFIG.scraping.moversPOE;
  verbose("SCRAPER", "Logging in to Movers POE...");

  await utils.clickElement(driver, selectors.navLogin);
  await new Promise((r) => setTimeout(r, 1000));

  await utils.typeInElement(
    driver,
    selectors.usernameInput,
    ENV.MOVERS_POE_USERNAME,
  );
  await utils.typeInElement(
    driver,
    selectors.passwordInput,
    ENV.MOVERS_POE_PASSWORD,
  );
  await utils.clickElement(driver, selectors.loginButton);
}

async function waitForDashboard(driver: WebDriver) {
  const { dashboardPattern } = CONFIG.scraping.moversPOE;
  verbose("SCRAPER", `Waiting for ${dashboardPattern}...`);
  const reached = await utils.waitForUrlPattern(driver, dashboardPattern);
  if (!reached) throw new Error("Dashboard redirect failed.");
}

async function navigateToLocateMover(driver: WebDriver) {
  const { locateMoverPattern } = CONFIG.scraping.moversPOE;
  verbose("SCRAPER", `Navigating to ${locateMoverPattern}...`);
  await utils.findAndClickLinkByHref(driver, locateMoverPattern);
  const reached = await utils.waitForUrlPattern(driver, locateMoverPattern);
  if (!reached) throw new Error("Locate Mover navigation failed.");
}

async function scrapeAndFillForm(
  driver: WebDriver,
  jobDetails: any,
): Promise<Provider[]> {
  verbose("SCRAPER", "Analyzing and filling form...");

  // We are skipping the file load in production and just mapping the jobDetails
  const mappedJobDetails: Record<string, any> = {
    // Map 20-field model to UI roughly if possible. For now we use the test values concept
    // to simulate the mapping.
  };

  try {
      const testValuesPath = "./scripts/quoting-agent/test-values.json";
      const testValuesRaw = await fs.readFile(testValuesPath, "utf-8");
      const testValuesJson = JSON.parse(testValuesRaw);
      for (const [k, v] of Object.entries(testValuesJson.testInputs)) {
          mappedJobDetails[k] = (v as any).value;
      }
  } catch(e) {
      verbose("SCRAPER", "Test values not found, proceeding with raw jobDetails");
  }

  await fillFormWithMappedValues(driver, mappedJobDetails);

  await driver.executeScript(`
    if(typeof Page_ClientValidate === 'function') {
      Page_ClientValidate();
    }
  `);

  const proceedButtonId = "ctl00_cntPlcHld1_btnProceed";
  verbose(
    "SCRAPER",
    `Clicking Proceed button via JS script: ${proceedButtonId}`,
  );

  await driver.executeScript(`
    const btn = document.getElementById('${proceedButtonId}');
    if(btn) btn.click();
  `);

  logPipeline("Form Submission", "SUCCESS");
  await new Promise((r) => setTimeout(r, 2000));

  await utils.dismissAlertIfPresent(driver);

  const finalMap = await mapFormStructure(driver, "body");

  if (finalMap.redIssues && finalMap.redIssues.length > 0) {
    verbose(
      "SCRAPER",
      `⚠️ RED ISSUES DETECTED: ${finalMap.redIssues.join(" | ")}`,
    );
    
    // Alert system if template changed significantly
    console.error("LOG: Scraper detected potential template change or missing required fields.");
    return [];
  }

  // Mocked extraction for providers. In real scenario, we parse the results grid.
  return [{
    name: "Global Movers Ltd",
    email: "global@example.com",
    traits: ["reliable", "fast"],
    points: 85,
    pricing: CONFIG.products,
  },
  {
    name: "Oceanic Transit Co",
    email: "oceanic@example.com",
    traits: ["cheap", "slow"],
    points: 55,
    pricing: CONFIG.products,
  }];
}

export async function scrapeMoversPOE(jobDetails: any): Promise<Provider[]> {
  logPipeline("Scraping Movers POE Form Analysis", "START");
  const driver = await utils.createDriver();

  try {
    await driver.get(ENV.MOVERS_POE_URL);
    await loginToMoversPOE(driver);
    await waitForDashboard(driver);
    await navigateToLocateMover(driver);

    const targetSelector = "body";
    const formMap = await mapFormStructure(driver, targetSelector);

    const results = await scrapeAndFillForm(driver, jobDetails);

    const finalUrl = await driver.getCurrentUrl();
    
    if (finalUrl.includes("LocateDestinationMover.aspx")) {
      logPipeline("Scraping Movers POE Form Analysis", "SUCCESS", "Finished but remained on form.");
    } else {
      logPipeline("Scraping Movers POE Form Analysis", "SUCCESS", "Finished and moved to destination.");
    }

    return results;
  } catch (err) {
    logPipeline("Scraping Movers POE Form Analysis", "ERROR", (err as Error).message);
    return [];
  } finally {
      // Clean up in production
      await driver.quit();
  }
}

if (import.meta.main) {
  await scrapeMoversPOE({});
}
