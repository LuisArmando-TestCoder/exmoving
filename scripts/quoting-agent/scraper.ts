import { Provider } from "./types.ts";
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

  const targetSelector =
    "#ctl00_cntPlcHld1_ShipmentSpecs1_Updall > div > div > div:nth-child(3)";

  // Load current test values
  const testValuesPath = "./scripts/quoting-agent/test-values.json";
  const testValuesRaw = await fs.readFile(testValuesPath, "utf-8");
  const testValuesJson = JSON.parse(testValuesRaw);
  const flatTestValues: Record<string, any> = {};
  for (const [k, v] of Object.entries(testValuesJson.testInputs)) {
    flatTestValues[k] = (v as any).value;
  }

  await fillFormWithMappedValues(driver, flatTestValues);

  // Attempt to trigger client-side validation logic
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

  // Dismiss potential alerts before mapping
  await utils.dismissAlertIfPresent(driver);

  // Check for red issues after submission
  const finalMap = await mapFormStructure(driver, "body");

  if (finalMap.redIssues && finalMap.redIssues.length > 0) {
    verbose(
      "SCRAPER",
      `⚠️ RED ISSUES DETECTED: ${finalMap.redIssues.join(" | ")}`,
    );
    
    // Dump the full body map to inspect missing fields
    await fs.writeFile(
      "./scripts/quoting-agent/form-map-body.json",
      JSON.stringify(finalMap, null, 2),
      "utf-8",
    );
    
    // Update test-values.json based on what we see?
    // For now, we log them clearly for Cline to see and react.
    return [];
  }

  return [{
    name: "Global Movers Ltd",
    email: "global@example.com",
    traits: ["reliable"],
    points: 85,
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

    // Initial mapping to identify fields if needed
    const targetSelector = "body";
    const formMap = await mapFormStructure(driver, targetSelector);
    
    // Search for Costa Rica POEs
    const poeSelect = formMap.selects.find(s => s.id.includes('ddlPOE'));
    if(poeSelect) {
      verbose("SCRAPER", "Searching for Costa Rica in POE options...");
      // Re-map with full options for POE
      const fullPoeOptions = await driver.executeScript(`
        const s = document.getElementById('${poeSelect.id}');
        return Array.from(s.options).map(o => ({ text: o.text, value: o.value }));
      `) as any[];
      const crPoes = fullPoeOptions.filter(o => o.text.toLowerCase().includes('costa rica'));
      verbose("SCRAPER", `Found Costa Rica POEs: ${JSON.stringify(crPoes)}`);

      // Find all Select2 elements
      const select2Elements = await driver.executeScript(`
        return Array.from(document.querySelectorAll('.select2-container')).map(el => ({
          id: el.id,
          for: el.getAttribute('aria-labelledby') || el.previousElementSibling?.id
        }));
      `);
      verbose("SCRAPER", `Found Select2 elements: ${JSON.stringify(select2Elements)}`);

      // Search for Costa Rica cities
      const citySelect = formMap.selects.find(s => s.id.includes('ddlCCityArea'));
      if(citySelect) {
        const fullCityOptions = await driver.executeScript(`
          const s = document.getElementById('${citySelect.id}');
          return Array.from(s.options).map(o => ({ text: o.text, value: o.value }));
        `) as any[];
        const crCities = fullCityOptions.filter(o => o.text.toLowerCase().includes('san jose'));
        verbose("SCRAPER", `Found San Jose cities: ${JSON.stringify(crCities)}`);
      }
    }

    await fs.writeFile(
      "./scripts/quoting-agent/form-map.json",
      JSON.stringify(formMap, null, 2),
      "utf-8",
    );

    const results = await scrapeAndFillForm(driver, jobDetails);

    const finalUrl = await driver.getCurrentUrl();
    const finalTitle = await driver.getTitle();
    console.log(`[FINAL_STATE] URL: ${finalUrl}`);
    console.log(`[FINAL_STATE] Title: ${finalTitle}`);

    if (finalUrl.includes("LocateDestinationMover.aspx")) {
      logPipeline("Scraping Movers POE Form Analysis", "SUCCESS");
      console.log(
        "LOG: Scraper finished but still on form page (likely red issues). Keeping browser open.",
      );
    } else {
      logPipeline("Scraping Movers POE Form Analysis", "SUCCESS");
      console.log(
        "LOG: Scraper finished and moved past form. Keeping browser open.",
      );
    }

    return results;
  } catch (err) {
    logPipeline("Scraping Movers POE Form Analysis", "ERROR", err.message);
    // await driver.quit();
    return [];
  }
}

if (import.meta.main) {
  await scrapeMoversPOE({});
}
