import { join } from "node:path";
import { mkdir, stat, writeFile, readFile } from "node:fs/promises";

// Minimal shim for parseArgs to avoid new dependencies if possible, 
// or use a simple regex-based parser since this is a local script.
function parseArgs(args: string[]) {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      result[key] = value;
    }
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));

if (!args.name || !args.path) {
  console.error("Usage: npx ts-node scripts/add-page.ts --name=\"Page Name\" --path=\"/path/to/page\"");
  process.exit(1);
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

async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function createPageFile(dirPath: string, componentName: string, title: string, isLeaf: boolean) {
  await ensureDir(dirPath);

  const pageFilePath = join(dirPath, "page.tsx");
  const scssFilePath = join(dirPath, `${componentName}.module.scss`);

  // Create empty SCSS
  try {
    await stat(scssFilePath);
  } catch {
    await writeFile(scssFilePath, `.page {\n  // Add styles here\n}\n`);
    console.log(`Created ${scssFilePath}`);
  }

  // Create Page TSX
  try {
    await stat(pageFilePath);
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
      personas={{
        title: "PERFECT FOR YOUR BUSINESS",
        items: [
          {
            title: "Example Persona",
            problem: "Description of the challenge being faced.",
            outcome: "How our solution transforms the workflow."
          }
        ]
      }}
      faqs={{
        title: "FREQUENTLY ASKED QUESTIONS",
        items: [
          {
            question: "Is there a free trial?",
            answer: "We offer tailored pilot programs for enterprise partners."
          }
        ]
      }}
      testimonials={{
        title: "WHAT OUR CUSTOMERS SAY",
        items: [
          {
            quote: "This automation has completely transformed how we handle our domain-specific tasks.",
            author: "Jane Doe",
            role: "CTO, Tech Solutions"
          }
        ]
      }}
      architecture={{
        title: "SYSTEM ARCHITECTURE",
        overview: "A highly modularized engine designed for performance and scalability.",
        components: [
          {
            name: "Core Processor",
            role: "ENGINE",
            details: [
              "Standardized data processing pipeline",
              "Real-time integrity checks",
              "Secure vault integration"
            ]
          }
        ]
      }}
      apiReference={{
        title: "API REFERENCE",
        endpoints: [
          {
            method: "GET",
            path: "/api/v1/resource",
            description: "Retrieve resource details.",
            params: [
              { name: "id", type: "string", desc: "Resource identifier" }
            ]
          }
        ]
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
    await writeFile(pageFilePath, content);
    console.log(`Created ${pageFilePath}`);
  }
}

async function updateNavigation() {
  let navContent = await readFile(NAV_FILE, "utf-8");
  
  const navMatch = navContent.match(/export const navigationData: NavItem\[\] = (\[[\s\S]*\]);/);
  if (!navMatch) {
    console.error("Could not parse navigation.ts");
    process.exit(1);
  }

  const jsCode = navContent.replace(/import .*\n/g, '').replace(/export interface NavItem \{[\s\S]*\}\n\n/, '').replace(/export const navigationData: NavItem\[\] = /, 'return ');
  
  let navArray;
  try {
    navArray = new Function(jsCode)();
  } catch (e) {
    console.error("Failed to evaluate navigation array", e);
    process.exit(1);
  }

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
      } as any;
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

  const newNavString = JSON.stringify(navArray, null, 2).replace(/"([^"]+)":/g, '$1:');
  
  const updatedFileContent = navContent.replace(
    /export const navigationData: NavItem\[\] = \[[\s\S]*\];/,
    `export const navigationData: NavItem[] = ${newNavString};`
  );
  
  await writeFile(NAV_FILE, updatedFileContent);
  console.log(`Updated ${NAV_FILE}`);
}

async function main() {
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const isLeaf = i === segments.length - 1;
    const componentName = getComponentName(segment);
    const title = isLeaf ? pageName : capitalize(segment);
    
    const dirPath = join(APP_DIR, ...segments.slice(0, i + 1));
    await createPageFile(dirPath, componentName, title, isLeaf);
  }
  
  await updateNavigation();
  console.log("Done!");
}

main().catch(console.error);
