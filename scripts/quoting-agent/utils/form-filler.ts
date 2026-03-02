import { By, until, WebDriver } from "npm:selenium-webdriver";
import { logPipeline, verbose } from "./logger.ts";

export interface TestValues {
  [id: string]: string | boolean;
}

export async function fillFormWithMappedValues(
  driver: WebDriver,
  testValues: TestValues,
) {
  logPipeline("Form Filling", "START");

  for (const [id, value] of Object.entries(testValues)) {
    try {
      verbose("FILLER", `Attempting to fill field: ${id} with value: ${value}`);
      const element = await driver.wait(until.elementLocated(By.id(id)), 5000);

      const tagName = await element.getTagName();
      const type = await element.getAttribute("type");

      if (tagName === "select") {
        // Check for Select2
        const isSelect2 = await driver.executeScript(`
          return !!document.getElementById('s2id_' + arguments[0].id);
        `, element);

        if (isSelect2) {
          verbose("FILLER", `Detected Select2 for dropdown ${id}, interacting...`);
          await driver.executeScript(`
            $('#' + arguments[0].id).val('${value}').trigger('change');
          `, element);
        } else {
          await driver.executeScript(`
            const select = arguments[0];
            select.value = '${value}';
            select.dispatchEvent(new Event('change', { bubbles: true }));
          `, element);
        }
        verbose("FILLER", `Selected value ${value} for dropdown ${id}`);
      } else if (type === "checkbox" || type === "radio") {
        const isChecked = await element.isSelected();
        if (isChecked !== value) {
          await driver.executeScript("arguments[0].click();", element);
          verbose("FILLER", `Toggled ${type} ${id} to ${value}`);
        }
      } else {
        // Use JS to set value directly with focus and events
        await driver.executeScript(`
          const el = arguments[0];
          el.focus();
          el.value = "${value}";
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('blur', { bubbles: true }));
        `, element);
        verbose("FILLER", `Set value "${value}" into ${id} via JS`);
      }

      // Delay to allow scripts to run
      await new Promise((r) => setTimeout(r, 1000));

      // Wait for blockers (.loadingDiv) to disappear if they appeared
      try {
        await driver.wait(async () => {
          const blockers = await driver.findElements(By.css(".loadingDiv"));
          if (blockers.length === 0) return true;
      const visible = await Promise.all(blockers.map((b: any) => b.isDisplayed()));
      return !visible.some((v: any) => v === true);
        }, 5000);
      } catch (e) {
        verbose("FILLER", "Loader wait timed out or failed, continuing...");
      }
    } catch (err) {
      verbose("FILLER", `Warning: Could not fill field ${id} - ${(err as Error).message}`);
    }
  }

  logPipeline("Form Filling", "SUCCESS");
}
