import { parseArgs } from "jsr:@std/cli/parse-args";
import { join } from "jsr:@std/path";
import { ensureDir } from "jsr:@std/fs";

const args = parseArgs(Deno.args);

if (!args.name || !args.path) {
  console.error("Usage: deno run -A scripts/add-page.ts --name=\"Page Name\" --path=\"/path/to/page\"");
  Deno.exit(1);
}

const pageName = args.name;
const pagePath = args.path.startsWith("/") ? args.path : `/${args.path}`;
const segments = pagePath.split("/").filter(Boolean);

const NAV_FILE = "src/constants/navigation.ts";
const APP_DIR = "src/app";

// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Generate component name from path segment
const getComponentName = (segment: string) => {
  return segment.split("-").map(capitalize).join("");
};

async function createPageFile(dirPath: string, componentName: string, title: string, isLeaf: boolean) {
  await ensureDir(dirPath);

  const pageFilePath = join(dirPath, "page.tsx");
  const scssFilePath = join(dirPath, `${componentName}.module.scss`);

  // Create empty SCSS
  try {
    const stat = await Deno.stat(scssFilePath);
  } catch {
    await Deno.writeTextFile(scssFilePath, `.page {\n  // Add styles here\n}\n`);
    console.log(`Created ${scssFilePath}`);
  }

  // Create Page TSX
  try {
    await Deno.stat(pageFilePath);
  } catch {
    let content = "";
    if (isLeaf) {
      content = `import AutomationServicePage from "@/components/ui/AutomationServicePage";
import styles from "./${componentName}.module.scss";

export default function ${componentName}Page() {
  return (
    <AutomationServicePage
      header={{
        badgeText: "New Automation Service",
        titleLine1: "${title.toUpperCase()}",
        titleGradient: "SOLUTIONS",
        subtitle: "A flexible and powerful solution tailored for your specific needs."
      }}
      features={[
        {
          iconName: "Brain",
          title: "Intelligent Core",
          description: "Smart processing customized for your domain.",
          metric: "High Efficiency",
          color: "blue"
        },
        {
          iconName: "Zap",
          title: "Rapid Deployment",
          description: "Get up and running in record time.",
          metric: "Fast",
          color: "amber"
        }
      ]}
      roiStats={[
        { label: "Cost Reduction", value: "30%", iconName: "TrendingDown", detail: "Average savings" },
        { label: "Time Saved", value: "10h+", iconName: "Clock", detail: "Per week" }
      ]}
      intelSection={{
        title: "HOW IT WORKS",
        subtitle: "The architecture behind the solution",
        details: [
          { iconName: "Activity", label: "Streamlined Workflow", description: "Efficient data processing." }
        ]
      }}
      economicsSection={{
        title: "ECONOMICS",
        description: "Transparent, performance-driven pricing based on real value.",
        modelName: "Optimized Engine",
        reportTitle: "Performance Metrics",
        reportSubtitle: "Real-time analysis",
        metrics: [
          { iconName: "BarChart3", label: "Efficiency", value: "99%", detail: "Resource utilization" }
        ],
        bottomLeftCard: { title: "Cost-Effective", description: "Maximize your ROI with intelligent automation.", roi: "20x" },
        bottomRightCard: { title: "Ready to Scale?", description: "Let's build your custom solution.", buttonText: "GET STARTED" }
      }}
    />
  );
}
`;
    } else {
      content = `import SimplePage from "@/components/SimplePage";
import styles from "./${componentName}.module.scss";

export default function ${componentName}Page() {
  return (
    <SimplePage title="${title}" description="Explore our ${title.toLowerCase()} offerings." />
  );
}
`;
    }
    await Deno.writeTextFile(pageFilePath, content);
    console.log(`Created ${pageFilePath}`);
  }
}

async function updateNavigation() {
  let navContent = await Deno.readTextFile(NAV_FILE);
  
  // Quick and dirty way to inject into navigation array
  // We'll read the existing navigation, parse it using eval (since it's a TS file with export const navigation = [...])
  // Wait, Deno eval might be tricky with imports. Let's do a pure string replacement or AST if possible.
  // Actually, string parsing to JSON is hard because it's a TS file, not pure JSON.
  // A simpler approach: Just run a node/deno script that uses standard regex or a simple AST to modify it.
  
  // Let's create a temporary JSON representation of the paths.
  // Or better, we can modify the string by looking for the export const navigation array.
  
  // Extract the array content
  const navMatch = navContent.match(/export const navigationData: NavItem\[\] = (\[[\s\S]*\]);/);
  if (!navMatch) {
    console.error("Could not parse navigation.ts");
    Deno.exit(1);
  }

  // To make it easy, we will define a recursive function that builds the desired structure
  // For the sake of this script, we'll read the file, try to parse it with a loose JSON parser or Function, update it, and stringify it.
  
  const jsCode = navContent.replace(/import .*\n/g, '').replace(/export interface NavItem \{[\s\S]*\}\n\n/, '').replace(/export const navigationData: NavItem\[\] = /, 'return ');
  
  let navArray;
  try {
    navArray = new Function(jsCode)();
  } catch (e) {
    console.error("Failed to evaluate navigation array", e);
    Deno.exit(1);
  }

  // Recursive add function
  function addToNav(navPath: any[], segments: string[], currentPath: string, finalName: string) {
    if (segments.length === 0) return;
    
    const segment = segments[0];
    const newPath = currentPath + "/" + segment;
    const isLeaf = segments.length === 1;
    
    let existingItem = navPath.find(item => item.path === newPath);
    
    if (!existingItem) {
      existingItem = {
        name: isLeaf ? finalName : capitalize(segment),
        path: newPath
      };
      if (!isLeaf) {
        existingItem.children = [];
      }
      navPath.push(existingItem);
    }
    
    if (!isLeaf) {
      if (!existingItem.children) existingItem.children = [];
      addToNav(existingItem.children, segments.slice(1), newPath, finalName);
    }
  }

  addToNav(navArray, segments, "", pageName);

  // Stringify it back formatting nicely
  const newNavString = JSON.stringify(navArray, null, 2).replace(/"([^"]+)":/g, '$1:');
  
  // Replace in original file
  const updatedFileContent = navContent.replace(
    /export const navigationData: NavItem\[\] = \[[\s\S]*\];/,
    `export const navigationData: NavItem[] = ${newNavString};`
  );
  
  await Deno.writeTextFile(NAV_FILE, updatedFileContent);
  console.log(`Updated ${NAV_FILE}`);
}

async function main() {
  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    const isLeaf = i === segments.length - 1;
    const componentName = getComponentName(segment);
    const title = isLeaf ? pageName : capitalize(segment);
    
    const dirPath = join(APP_DIR, ...segments.slice(0, i + 1));
    await createPageFile(dirPath, componentName, title, isLeaf);
  }
  
  await updateNavigation();
  console.log("Done!");
}

main();
