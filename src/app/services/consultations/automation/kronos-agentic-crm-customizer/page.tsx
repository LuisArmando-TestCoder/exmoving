import AutomationServicePage from "@/components/ui/AutomationServicePage";
import styles from "./KronosAgenticCrmCustomizer.module.scss";
import { KronosFlowchart, FlowNode } from "./KronosFlowchart";

export default function KronosAgenticCrmCustomizerPage() {
  const customStyles = styles;

  const flowchartData: FlowNode[] = [
    { type: 'node', text: 'HTTP Request' },
    { type: 'arrow', text: '→' },
    { 
      type: 'diamond_wrapper', 
      subNodes: [{ type: 'diamond', text: 'UIDBM Router' }] 
    },
    {
      type: 'branch_container',
      subNodes: [
        {
          type: 'node',
          subNodes: [
            { type: 'label', text: 'GET /schema' },
            { type: 'node', text: 'Schema Manager' }
          ]
        },
        {
          type: 'node',
          subNodes: [
            { type: 'label', text: 'POST /:coll' },
            { type: 'node', text: 'Validator [Pass]' },
            { type: 'arrow', text: '↓' },
            { type: 'node', text: 'Security [Pass]' },
            { type: 'arrow', text: '↓' },
            { type: 'node', text: 'Logic & Plans [Pass]' },
            { type: 'arrow', text: '↓' },
            { type: 'node', text: 'CRUD Helper' },
            { type: 'arrow', text: '↓' },
            { type: 'database', text: 'DB (Firestore)' }
          ]
        }
      ]
    }
  ];

  return (
    <div className={styles.page}>
      <AutomationServicePage
        header={{
          badgeText: "Enterprise CRM Engine",
          titleLine1: "KRONOS",
          titleGradient: "AGENTIC CRM",
          subtitle: "The UI Database Module (UIDBM) decoupling application logic from implementation for maximum scalability."
        }}
        features={[
          {
            iconName: "Layers",
            title: "Schema-Driven",
            description: "Adapt behavior instantly based on JSON configuration files without rewriting controllers.",
            metric: "Zero Code",
            color: "blue"
          },
          {
            iconName: "ShieldCheck",
            title: "Secure by Design",
            description: "Built-in auth walls, field-level encryption, and 6-digit verification codes for sensitive data.",
            metric: "High Security",
            color: "emerald"
          },
          {
            iconName: "Cpu",
            title: "Logic Injection",
            description: "Execute cross-field validation and plan-based limits directly through the schema engine.",
            metric: "Dynamic",
            color: "amber"
          }
        ]}
        roiStats={[
          { label: "Logic Decoupling", value: "100%", iconName: "Layers", detail: "App logic separated from implementation" },
          { label: "Deployment", value: "Instant", iconName: "Zap", detail: "Schema updates take effect immediately" },
          { label: "Maintenance", value: "Low", iconName: "Activity", detail: "Minimal controller management" }
        ]}
        economicsSection={{
          title: "ENTERPRISE ECONOMICS",
          description: "Scale your CRM infrastructure without increasing development overhead.",
          modelName: "UIDBM Engine v4",
          reportTitle: "Performance Metrics",
          reportSubtitle: "System Throughput",
          metrics: [
            { iconName: "Zap", label: "Resolution", value: "12ms", detail: "Schema lookup time" },
            { iconName: "ShieldCheck", label: "Security", value: "100%", detail: "Encryption coverage" },
            { iconName: "BarChart3", label: "Efficiency", value: "99.9%", detail: "Uptime and reliability" }
          ],
          bottomLeftCard: { title: "Ready for Scale?", description: "Decouple your logic today and build at the speed of thought.", roi: "50x Speed" },
          bottomRightCard: { title: "Get a Technical Audit", description: "Let's discuss your schema requirements and deployment strategy.", buttonText: "GET STARTED" }
        }}
        customBlocks={[
          {
            title: "UIDBM ARCHITECTURE",
            subtitle: "A generic backend engine designed to decouple App Logic from Implementation through a Schema Metastore.",
            content: (
              <div className={customStyles.docSection}>
                {/* 
                    UIDBM ARCHITECTURE - OVERVIEW 
                    The UIDBM (UI Database Module) is designed to decouple "App Logic" from "Implementation".
                    Instead of writing custom controllers for every data type, we use a single Schema Controller.
                */}
                <div className={customStyles.overviewBlock}>
                  <p>The <strong>UIDBM (UI Database Module)</strong> is a generic backend engine designed to decouple "App Logic" from "Implementation". In a traditional app, developers write specific controllers for specific data types (e.g., <code>UserController</code>). In UIDBM, there is only one controller: the <strong>Schema Controller</strong>, which adapts its behavior based on a configuration file.</p>
                </div>

                <KronosFlowchart data={flowchartData} />

                <div className={customStyles.docGrid}>
                  <div className={customStyles.docCard}>
                    <div className={customStyles.docBadge}>METASTORE</div>
                    <h3>1. The Schema Store</h3>
                    <p>Acts as the "Metastore", stored in a specific Firestore collection named <code>_schemas</code>.</p>
                    <ul>
                      <li><strong>ID:</strong> Name of the collection (e.g., <code>products</code>).</li>
                      <li><strong>Body:</strong> JSON Schema defining fields, types, and rules.</li>
                    </ul>
                  </div>
                  <div className={customStyles.docCard}>
                    <div className={customStyles.docBadge}>RUNTIME</div>
                    <h3>2. The Engine</h3>
                    <p>Deno + Express runtime intercepting HTTP requests and processing them through a strict pipeline.</p>
                  </div>
                  <div className={customStyles.docCard}>
                    <div className={customStyles.docBadge}>STAGES</div>
                    <h3>3. Pipeline Stages</h3>
                    <ul>
                      <li><strong>A. Schema Resolution:</strong> Loads schema for requested <code>:collection</code>.</li>
                      <li><strong>B. Validation:</strong> Type checking, constraints, uniqueness, cross-field logic.</li>
                      <li><strong>C. Security:</strong> Auth Wall verification and field-level encryption.</li>
                      <li><strong>D. Integrity:</strong> Referential integrity checks and cascading deletes.</li>
                      <li><strong>E. Persistence:</strong> Final DB operation.</li>
                    </ul>
                  </div>
                </div>

                <div className={customStyles.exampleBox}>
                  <h4>Data Flow Example: Creating a Product</h4>
                  <ol className={customStyles.flowList}>
                    <li><strong>Request:</strong> <code>POST /api/uidbm/products</code> with <code>{`{ "name": "Box", "price": 10 }`}</code>.</li>
                    <li><strong>Schema Lookup:</strong> Fetch <code>_schemas/products</code>.</li>
                    <li><strong>Validation:</strong> Type check OK? Required fields OK? Plan limits OK?</li>
                    <li><strong>Security:</strong> Is <code>authWall</code> enabled? [No].</li>
                    <li><strong>Write:</strong> Save to <code>products</code> collection.</li>
                    <li><strong>Response:</strong> Return created document.</li>
                  </ol>
                </div>
              </div>
            )
          },
          {
            title: "UIDBM SCHEMA REFERENCE",
            subtitle: "The blueprint for your application defining structure, validation, and UI behavior.",
            content: (
              <div className={customStyles.schemaDoc}>
                <div className={customStyles.codeWrapper}>
                  <h4>Root Structure</h4>
                  <pre className={customStyles.codeBlock}>
{`{
  "Products": {
    "_settings": { ... },
    "name": { ... },
    "price": { ... }
  },
  "Users": { ... }
}`}
                  </pre>
                </div>

                <h4>Collection Settings (_settings)</h4>
                <table className={customStyles.dataTable}>
                  <thead>
                    <tr><th>Field</th><th>Type</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>pagination</code></td><td>Object</td><td><code>{`{ "default": 20, "max": 100 }`}</code></td></tr>
                    <tr><td><code>sorting</code></td><td>Object</td><td><code>{`{ "by": "createdAt", "order": "desc" }`}</code></td></tr>
                    <tr><td><code>indexes</code></td><td>Array</td><td>List of compound indexes for uniqueness.</td></tr>
                  </tbody>
                </table>

                <h4>Common Properties</h4>
                <div className={customStyles.propertyGrid}>
                  <div className={customStyles.propItem}><strong>type:</strong> string, number, boolean, array, object, media, breadcrumb, email, date, color.</div>
                  <div className={customStyles.propItem}><strong>required:</strong> If true, the field must be present on creation.</div>
                  <div className={customStyles.propItem}><strong>unique:</strong> If true, value must be unique across the collection.</div>
                  <div className={customStyles.propItem}><strong>default:</strong> Default value if not provided.</div>
                  <div className={customStyles.propItem}><strong>editable:</strong> If false, can only be set on creation.</div>
                  <div className={customStyles.propItem}><strong>private:</strong> If true, field is stripped from API responses.</div>
                  <div className={customStyles.propItem}><strong>protected:</strong> If true, only accessible by specific roles (RBAC).</div>
                  <div className={customStyles.propItem}><strong>encrypted:</strong> Stores data as ciphertext in the database.</div>
                  <div className={customStyles.propItem}><strong>authWall:</strong> Requires 6-digit code for read/write access.</div>
                  <div className={customStyles.propItem}><strong>regex:</strong> Regex pattern for validation.</div>
                </div>
              </div>
            )
          },
          {
            title: "UIDBM API REFERENCE",
            subtitle: "Uniform REST API for all collections defined in the schema.",
            content: (
              <div className={customStyles.apiDoc}>
                <h3>Schema Management</h3>
                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.get}>GET</span>
                    <code>/api/uidbm/schema</code>
                  </div>
                  <p>Retrieve the full application schema. Returns 200 OK (JSON Schema Object).</p>
                </div>
                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.post}>POST</span>
                    <code>/api/uidbm/schema/:collection</code>
                  </div>
                  <p>Create or update the schema for a specific collection.</p>
                </div>

                <h3>Generic CRUD</h3>
                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.post}>POST</span>
                    <code>/api/uidbm/:collection</code>
                  </div>
                  <p>Create a new document. Validates types, regex, uniqueness, checks Plan Limits, Enciphers encrypted fields, generates auth-code.</p>
                  <table className={customStyles.apiTable}>
                    <thead>
                      <tr><th>Param</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><code>Authorization</code></td><td>Header</td><td>Bearer token (if protected)</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.get}>GET</span>
                    <code>/api/uidbm/:collection</code>
                  </div>
                  <p>List documents. Filters private fields, resolves breadcrumbs.</p>
                  <table className={customStyles.apiTable}>
                    <thead>
                      <tr><th>Param</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><code>page</code></td><td>Query</td><td>Page number (default 1)</td></tr>
                      <tr><td><code>limit</code></td><td>Query</td><td>Items per page (default 20)</td></tr>
                      <tr><td><code>sort / order</code></td><td>Query</td><td>Field to sort by / asc or desc</td></tr>
                      <tr><td><code>q</code></td><td>Query</td><td>Search query (searches indexed fields)</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.get}>GET</span>
                    <code>/api/uidbm/:collection/:id</code>
                  </div>
                  <p>Read a single document. Verifies Auth Code, decrypts fields.</p>
                  <table className={customStyles.apiTable}>
                    <thead>
                      <tr><th>Param</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><code>x-auth-code</code></td><td>Header</td><td>6-digit code (if authWall: true)</td></tr>
                    </tbody>
                  </table>
                </div>
                
                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.patch}>PATCH</span>
                    <code>/api/uidbm/:collection/:id</code>
                  </div>
                  <p>Update a document. Checks editable flags, re-validates changed fields.</p>
                  <table className={customStyles.apiTable}>
                    <thead>
                      <tr><th>Param</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><code>x-auth-code</code></td><td>Header</td><td>6-digit code (if authWall: true)</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.delete}>DELETE</span>
                    <code>/api/uidbm/:collection/:id</code>
                  </div>
                  <p>Delete a document. Checks Referential Integrity, cascades deletes if configured.</p>
                  <table className={customStyles.apiTable}>
                    <thead>
                      <tr><th>Param</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><code>x-auth-code</code></td><td>Header</td><td>6-digit code (if authWall: true)</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3>Auth & Security</h3>
                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.post}>POST</span>
                    <code>/api/uidbm/auth/code</code>
                  </div>
                  <p>Generate and email an Auth Code for a specific document.</p>
                </div>
                <div className={customStyles.apiEndpoint}>
                  <div className={customStyles.apiHead}>
                    <span className={customStyles.post}>POST</span>
                    <code>/api/uidbm/auth/verify</code>
                  </div>
                  <p>Verify an Auth Code without performing an operation.</p>
                </div>
              </div>
            )
          },
          {
            title: "VALIDATION & SECURITY MODULES",
            subtitle: "Ensuring data integrity and robust security before any data touches Firestore.",
            content: (
              <div className={customStyles.docSection}>
                <div className={customStyles.featureGrid}>
                  <div className={customStyles.featureBlock}>
                    <h4>Core Validation Checks</h4>
                    <ul>
                      <li><strong>Type Enforcement:</strong> string, number, boolean, array, email, breadcrumb.</li>
                      <li><strong>Constraints:</strong> Required, Regex (e.g., <code>^[A-Z]{3}-\\d{3}$</code>), Uniqueness via pre-flight queries.</li>
                      <li><strong>Immutable Fields:</strong> Checked during PATCH, comparing existing vs new values.</li>
                    </ul>
                    <h4>Cross-Field Logic</h4>
                    <pre className={customStyles.codeBlock}>
{`"endDate": {
    "type": "date",
    "validation": {
        "rule": "this.endDate > this.startDate",
        "message": "End date must be after start date"
    }
}`}
                    </pre>
                  </div>
                  <div className={customStyles.featureBlock}>
                    <h4>Auth Wall (authWall)</h4>
                    <p>For sensitive documents. Requires a one-time 6-digit code for interaction.</p>
                    <ol>
                      <li>System generates random 6-digit code and hashes it.</li>
                      <li>Stores hash in reserved <code>auth-code</code> field.</li>
                      <li>Emails cleartext to user.</li>
                      <li>User must provide <code>x-auth-code</code> header for GET/PATCH/DELETE.</li>
                    </ol>
                    <h4>Encryption (encrypted)</h4>
                    <p>Ensures data at rest is unreadable by DB admins using server-side AES-256 AES-GCM (Format: <code>iv:ciphertext</code>).</p>
                    <h4>Role Based Access (protected)</h4>
                    <p>Checks user role from standard Authorization Bearer token.</p>
                  </div>
                </div>
              </div>
            )
          },
          {
            title: "INTEGRITY & UI GENERATION",
            subtitle: "Preventing orphaned data and dynamically rendering the frontend.",
            content: (
              <div className={customStyles.docSection}>
                 <div className={customStyles.featureGrid}>
                  <div className={customStyles.featureBlock}>
                    <h4>Integrity Module</h4>
                    <p>Prevents "orphaned data" using breadcrumb references (e.g., <code>type: "breadcrumb"</code>).</p>
                    <pre className={customStyles.codeBlock}>
{`"owner_id": {
    "type": "breadcrumb",
    "ref": "Users",
    "onDelete": "cascade"
}`}
                    </pre>
                    <p><strong>Cascading Deletes:</strong> Scans all schemas. Executes <code>cascade</code> (recursive delete), <code>restrict</code> (blocks delete if refs exist), or <code>nullify</code>.</p>
                    <p><strong>Auto-Resolution:</strong> <code>GET ?resolve=true</code> hydrates breadcrumb IDs into full objects.</p>
                  </div>
                  <div className={customStyles.featureBlock}>
                    <h4>UI Generation Module</h4>
                    <p>The <code>ui</code> object tells the frontend component library how to render fields dynamically.</p>
                    <pre className={customStyles.codeBlock}>
{`"description": {
    "type": "string",
    "ui": {
        "label": "Product Description",
        "widget": "markdown",
        "group": "Marketing",
        "colSpan": 12
    }
}`}
                    </pre>
                    <p>Widgets include: text, textarea, markdown, number, slider, toggle, select, datepicker, file.</p>
                  </div>
                </div>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
