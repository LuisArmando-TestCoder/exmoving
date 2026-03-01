import { WebDriver } from "npm:selenium-webdriver";
import { logPipeline, verbose } from "./logger.ts";

export interface FormMap {
  labels: Array<{ for: string | null; text: string }>;
  inputs: Array<
    { id: string; name: string; type: string; value: string; checked: boolean }
  >;
  selects: Array<
    { id: string; name: string; optionCount: number; sampleOptions: any[] }
  >;
  redIssues?: string[];
  error?: string;
}

export async function mapFormStructure(
  driver: WebDriver,
  selector: string,
): Promise<FormMap> {
  verbose("MAPPER", `Mapping structure for selector: ${selector}`);

  const formStructureMap = await driver.executeScript(`
    const container = document.querySelector('${selector}');
    const body = document.body;
    
    const map = { inputs: [], selects: [], labels: [], redIssues: [] };
    
    // Scrape issues in red
    const redElements = document.querySelectorAll('*');
    redElements.forEach(el => {
      if (el.style && el.style.color === 'red' && el.innerText.trim().length > 0) {
        map.redIssues.push(el.innerText.trim());
      }
    });

    if (!container) return map;

    // Gather all labels for context mapping
    const labels = container.querySelectorAll('label');
    labels.forEach(l => {
      if(l.htmlFor) map.labels.push({ for: l.htmlFor, text: l.innerText.trim() });
    });

    // Gather text/radio/checkbox inputs
    const inputs = container.querySelectorAll('input:not([type="hidden"])');
    inputs.forEach(i => {
      map.inputs.push({
        id: i.id,
        name: i.name,
        type: i.type,
        value: i.value,
        checked: i.checked
      });
    });

    // Gather Selects and their options
    const selects = container.querySelectorAll('select');
    selects.forEach(s => {
      const options = Array.from(s.options).map(o => ({
        text: o.text.trim(),
        value: o.value
      }));
      
      const summarizedOptions = options.length > 20 
        ? [options[0], options[1], { text: '... (' + (options.length - 3) + ' more)', value: '...' }, options[options.length - 1]] 
        : options;

      map.selects.push({
        id: s.id,
        name: s.name,
        optionCount: options.length,
        sampleOptions: summarizedOptions
      });
    });

    return map;
  `);

  const results = formStructureMap as FormMap;
  if (results.redIssues && results.redIssues.length > 0) {
    verbose(
      "MAPPER",
      `⚠️ Detected red issues: ${results.redIssues.join(" | ")}`,
    );
  }

  return results;
}
