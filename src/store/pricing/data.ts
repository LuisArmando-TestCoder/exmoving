import { APIPrice, InfrastructureItem } from './types';

export const INITIAL_API_PRICES: APIPrice[] = [
  {
    id: 'gemini-flash',
    name: 'Gemini Flash Latest',
    provider: 'Google',
    intelligence: 'Fast / Basic',
    inputPrice: 0.15,
    outputPrice: 1.25,
    emailCapacity: 6000000,
    isGenerative: true,
    category: 'llm',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    intelligence: 'Fast / Efficient',
    inputPrice: 0.15,
    outputPrice: 0.60,
    emailCapacity: 4500000,
    isGenerative: true,
    category: 'llm',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    intelligence: 'High / Creative',
    inputPrice: 3.00,
    outputPrice: 15.00,
    emailCapacity: 150000,
    isGenerative: true,
    category: 'llm',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    intelligence: 'High / Versatile',
    inputPrice: 1.75,
    outputPrice: 14.00,
    emailCapacity: 180000,
    isGenerative: true,
    category: 'llm',
  },
  {
    id: 'openai-o1',
    name: 'OpenAI o1',
    provider: 'OpenAI',
    intelligence: 'Complex Reasoning',
    inputPrice: 15.00,
    outputPrice: 60.00,
    emailCapacity: 30000,
    isGenerative: true,
    category: 'llm',
  },
];

export const INITIAL_INFRASTRUCTURE: InfrastructureItem[] = [
  {
    id: 'intelligence',
    name: 'Intelligence & Reasoning (LLMs)',
    description: 'The "brains" that process logic and natural language.',
    category: 'Intelligence',
    subItems: [
      {
        id: 'openai-api',
        name: 'OpenAI API (GPT-4o / o1)',
        description: 'Industry standard for general reasoning tasks. No true free tier, occasional $5–18 new-user credits.',
        pricingType: 'slider',
        hasFreeTier: false,
        payAsYouGoDetails: 'GPT-4o: $1.75 / 1M Input | $14.00 / 1M Output. Context up to 400k+.',
        slider: { 
          min: 0, 
          max: 100, 
          step: 1, 
          unit: 'M Tokens (Combined)', 
          multiplier: 7.87,
          baTranslation: { multiplier: 1.5, humanUnit: 'k Emails Drafted', roiMultiplier: 40, roiUnit: 'Hours of Writing' }
        }
      },
      {
        id: 'gemini',
        name: 'Gemini (Google)',
        description: 'Best for massive context windows (up to 2M tokens). Extremely generous free tier for developers.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: '500 requests/day grounding, millions of tokens free on Flash.',
        payAsYouGoDetails: 'Flash: $0.15–0.30 / 1M Input | $1.25 / 1M Output. Pro: ~$2–4 / $12–18',
        slider: { 
          min: 0, 
          max: 100, 
          step: 1, 
          unit: 'M Tokens', 
          multiplier: 0.70,
          baTranslation: { multiplier: 1.5, humanUnit: 'k Emails Drafted', roiMultiplier: 40, roiUnit: 'Hours of Writing' }
        }
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        description: 'High-performance, ultra-low-cost alternative to OpenAI. 64k–128k context.',
        pricingType: 'slider',
        hasFreeTier: false,
        payAsYouGoDetails: 'deepseek-chat/reasoner: Input $0.028–0.28, Output $0.42–1.68',
        slider: { 
          min: 0, 
          max: 500, 
          step: 10, 
          unit: 'M Tokens', 
          multiplier: 0.98,
          baTranslation: { multiplier: 1.5, humanUnit: 'k Code Snippets Gen', roiMultiplier: 10, roiUnit: 'Dev Hours Saved' }
        }
      },
      {
        id: 'groq',
        name: 'Groq (Llama 3 / Mixtral)',
        description: 'Ultra-low latency inference engine. The fastest API on the market. Batch 50% off.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: 'Free trial credits via console.',
        payAsYouGoDetails: 'Llama 3.1 8B: $0.05 in / $0.08 out. 70B: ~$0.59 / $0.79',
        slider: { 
          min: 0, 
          max: 100, 
          step: 1, 
          unit: 'M Tokens', 
          multiplier: 0.69,
          baTranslation: { multiplier: 1.5, humanUnit: 'k Fast Chat Replies', roiMultiplier: 25, roiUnit: 'Support Hours Saved' }
        }
      }
    ],
  },
  {
    id: 'voice',
    name: 'Voice & Conversational AI',
    description: 'Infrastructure to handle real-time audio and phone systems.',
    category: 'Voice',
    subItems: [
      {
        id: 'vapi',
        name: 'Vapi (Orchestrator)',
        description: 'Voice AI orchestrator. Connects LLM, STT, and TTS into low-latency pipelines.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: '$10 free credit. 10 concurrent calls included.',
        payAsYouGoDetails: 'Hosting $0.05/min + provider costs at cost. +$10/line/mo extra.',
        slider: { 
          min: 0, 
          max: 10000, 
          step: 100, 
          unit: 'Minutes', 
          multiplier: 0.05,
          baTranslation: { multiplier: 0.2, humanUnit: 'k Support Calls', roiMultiplier: 1, roiUnit: 'Human Agent Equiv.' }
        }
      },
      {
        id: 'twilio',
        name: 'Twilio (Phone/SMS)',
        description: 'Infrastructure for buying phone numbers, SIP trunking, and SMS.',
        pricingType: 'mixed',
        hasFreeTier: true,
        freeTierDetails: 'Some free tasks/trial credits available.',
        payAsYouGoDetails: 'Voice: ~$0.0085–0.014/min | SMS: ~$0.0075–0.0083/msg | WhatsApp: ~$0.005/msg',
        tiers: [
          { name: 'Starter (1 Number)', price: 1, features: ['1 Local Number', 'PAYG Voice/SMS'] },
          { name: 'Growth (10 Numbers)', price: 10, features: ['10 Local Numbers', 'Volume Discounts'] }
        ]
      },
      {
        id: 'deepgram',
        name: 'Deepgram (STT)',
        description: 'High-speed Speech-to-Text. Essential for fast voice bots.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: '$200 free credit.',
        payAsYouGoDetails: 'STT Nova-3 ~$0.0047–0.0092/min. TTS $0.015–0.03/1k chars.',
        slider: { 
          min: 0, 
          max: 10000, 
          step: 100, 
          unit: 'Minutes', 
          multiplier: 0.007,
          baTranslation: { multiplier: 0.3, humanUnit: 'Transcripts Logged', roiMultiplier: 0.5, roiUnit: 'Admin Hours Saved' }
        }
      },
      {
        id: 'elevenlabs',
        name: 'ElevenLabs (TTS)',
        description: 'High-fidelity Text-to-Speech and voice cloning.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: '10k chars/mo free (no commercial rights).',
        payAsYouGoDetails: 'Overages ~$0.06–0.15 per 1k chars.',
        tiers: [
          { name: 'Free', price: 0, features: ['10k chars/mo', 'No Commercial Use'], isFree: true, limits: '~10 mins generated' },
          { name: 'Starter', price: 5, features: ['30k chars/mo', 'Commercial Use'], limits: '~30 mins generated' },
          { name: 'Creator', price: 22, features: ['100k chars/mo', 'High Quality PVC'], limits: '~2 hours generated' },
          { name: 'Pro', price: 99, features: ['500k chars/mo', 'Highest Quality'], limits: '~10 hours generated' },
          { name: 'Business', price: 1320, features: ['Volume Discount', 'Priority Support'], limits: 'Enterprise scale' }
        ]
      }
    ]
  },
  {
    id: 'database',
    name: 'Database & State Management',
    description: 'Where the "Source of Truth" for business data lives.',
    category: 'Data',
    subItems: [
      {
        id: 'supabase',
        name: 'Supabase (PostgreSQL)',
        description: 'Managed PostgreSQL with auth and real-time capabilities.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: '500 MB DB, 50k MAU, 1 GB storage, 5 GB egress, 2 projects.',
        payAsYouGoDetails: 'DB $0.125/GB, MAU $0.00325, Storage $0.25/GB, Egress $0.09/GB.',
        tiers: [
          { name: 'Free', price: 0, features: ['500MB DB (~500k rows)', '50k MAU Auth'], isFree: true, limits: 'Shared Compute' },
          { name: 'Pro', price: 25, features: ['8GB DB (~8M rows)', '100k MAU Auth', '$10 Compute Included'], limits: 'Pay-as-you-go beyond limits' },
          { name: 'Team', price: 599, features: ['SOC2', 'HIPAA', '14-day Backups'], limits: 'Enterprise grade support' }
        ]
      },
      {
        id: 'firestore',
        name: 'Firestore (GCP)',
        description: 'NoSQL document database for real-time syncing. Multi-region.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: '1 GiB storage, 50k reads, 20k writes/deletes/day, 10 GiB egress/mo.',
        payAsYouGoDetails: 'Reads $0.03/100k, Writes $0.09/100k, Storage ~$0.18–0.30/GiB/mo.',
        slider: { 
          min: 0, 
          max: 100, 
          step: 1, 
          unit: 'M Reads/Writes', 
          multiplier: 0.60,
          baTranslation: { multiplier: 50, humanUnit: 'k Active App Sessions', roiMultiplier: 100, roiUnit: '% Uptime Peace of Mind' }
        }
      },
      {
        id: 'airtable',
        name: 'Airtable',
        description: '"No-code" relational database used as a user-friendly backend.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: '1k records/base, 1 GB attachments, 100 automations/mo.',
        tiers: [
          { name: 'Free', price: 0, features: ['1k records/base', '1GB attachments'], isFree: true, limits: 'Max 5 editors' },
          { name: 'Team', price: 20, features: ['50k records/base', '20GB attachments'], limits: 'Billed per seat/editor/mo' },
          { name: 'Business', price: 45, features: ['125k records/base', '100GB attachments'], limits: 'Billed per seat/editor/mo' }
        ]
      },
      {
        id: 'redis',
        name: 'Redis (Upstash/Cloud)',
        description: 'Ultra-fast in-memory data store for caching. Scales to zero.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: 'Free tier: small instance, limited commands.',
        payAsYouGoDetails: '$0.20/100k commands + $0.25/GB storage.',
        tiers: [
          { name: 'Free', price: 0, features: ['Basic Cache', 'Limited Commands'], isFree: true, limits: 'Development only' },
          { name: 'Fixed/PAYG', price: 10, features: ['Production Ready', 'Scalable'], limits: 'Starts at $10/mo' }
        ]
      },
      {
        id: 'typesense',
        name: 'Typesense (Cloud)',
        description: 'Open-source search engine. Dedicated RAM/CPU/HA, no per-search fees.',
        pricingType: 'slider',
        hasFreeTier: false,
        payAsYouGoDetails: 'Hourly cluster (~$0.03/hr small = $21.60/mo). Bandwidth $0.09/GB after 10 GB free.',
        slider: { 
          min: 1, 
          max: 20, 
          step: 1, 
          unit: 'Clusters', 
          multiplier: 21.60,
          baTranslation: { multiplier: 1, humanUnit: 'M Instant Searches', roiMultiplier: 20, roiUnit: '% Conv. Lift' }
        }
      }
    ]
  },
  {
    id: 'hosting',
    name: 'Hosting & Compute',
    description: 'The "soil" where your code and automation engines run.',
    category: 'Infrastructure',
    subItems: [
      {
        id: 'hetzner',
        name: 'Hetzner (Cloud VPS)',
        description: 'Unbeatable price-to-performance VPS power. Great for self-hosting n8n or Docker.',
        pricingType: 'tiers',
        hasFreeTier: false,
        payAsYouGoDetails: 'Hourly billing available. Traffic mostly included (20 TB EU).',
        tiers: [
          { name: 'CX11', price: 4.50, features: ['1 vCPU', '2GB RAM', '20GB NVMe'], limits: 'Runs 1-3 basic internal bots' },
          { name: 'CPX21', price: 8.50, features: ['3 vCPU', '4GB RAM', '80GB NVMe'], limits: 'Runs heavy n8n workflows' },
          { name: 'CPX31', price: 15.50, features: ['4 vCPU', '8GB RAM', '160GB NVMe'], limits: 'Agency scale self-hosting' }
        ]
      },
      {
        id: 'render',
        name: 'Render (Managed Hosting)',
        description: 'PaaS for Node.js, Python apps. 100 GB–1 TB bandwidth included.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: 'Hobby: free instances (limited hrs).',
        payAsYouGoDetails: 'Pro $19/user/mo + instances. Instances from $7/mo (512 MB).',
        tiers: [
          { name: 'Free', price: 0, features: ['512MB RAM', '0.1 CPU'], isFree: true, limits: 'Spins down, 750 free hours/mo' },
          { name: 'Starter', price: 7, features: ['512MB RAM', '0.1 CPU'], limits: 'Always on, Handles light web traffic' },
          { name: 'Standard', price: 25, features: ['2GB RAM', '1 CPU'], limits: 'Production ready API hosting' }
        ]
      },
      {
        id: 'netlify',
        name: 'Netlify',
        description: 'Hosting for frontend interfaces and static sites.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: '100 GB bandwidth, build mins included.',
        payAsYouGoDetails: 'Usage-based credits. Sites pause at limit.',
        tiers: [
          { name: 'Free', price: 0, features: ['100GB Bandwidth', 'Basic Builds'], isFree: true, limits: 'Personal projects' },
          { name: 'Pro', price: 20, features: ['1TB Bandwidth', 'Team Collab'], limits: 'Per member/mo' }
        ]
      },
      {
        id: 'aws-lambda',
        name: 'AWS / GCP Functions',
        description: 'Serverless compute for isolated scripts. Scales to zero.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: '1M requests + 400k GB-s/mo free.',
        payAsYouGoDetails: '$0.20/1M requests + $0.00001667/GB-s.',
        slider: { 
          min: 0, 
          max: 100, 
          step: 1, 
          unit: 'M Requests', 
          multiplier: 0.20,
          baTranslation: { multiplier: 1, humanUnit: 'M Isolated Tasks Executed', roiMultiplier: 99, roiUnit: '% Server Uptime' }
        }
      },
      {
        id: 'cloudflare-r2',
        name: 'Cloudflare R2 (Storage)',
        description: 'Best S3 alternative. ZERO egress fees.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: '10 GB storage, 1M Class A, 10M Class B ops/mo.',
        payAsYouGoDetails: 'Storage $0.015/GB/mo, ops cheap, ZERO egress.',
        slider: { 
          min: 0, 
          max: 1000, 
          step: 10, 
          unit: 'GB Storage', 
          multiplier: 0.015,
          baTranslation: { multiplier: 50, humanUnit: 'k High-Res Assets Stored', roiMultiplier: 0, roiUnit: 'Egress Fees (Saved)' }
        }
      }
    ]
  },
  {
    id: 'automation',
    name: 'Automation & Workflow',
    description: 'The "glue" that connects all APIs together.',
    category: 'Orchestration',
    subItems: [
      {
        id: 'n8n',
        name: 'n8n (Workflow Engine)',
        description: 'The primary workflow tool for engineers. Highly extensible node-based automation.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: 'Self-hosted Community Edition is 100% free with unlimited executions.',
        payAsYouGoDetails: 'No PAYG - execution-based on cloud.',
        tiers: [
          { name: 'Self-Hosted', price: 0, features: ['Unlimited Execs', 'Your Infrastructure'], isFree: true, limits: 'Requires hosting (e.g. Hetzner $5/mo)' },
          { name: 'Cloud Starter', price: 20, features: ['2,500 Execs/mo', 'Managed Hosting'], limits: '5 Active Workflows' },
          { name: 'Cloud Pro', price: 50, features: ['10,000 Execs/mo', 'Variables & Logs'], limits: 'Business/Enterprise custom' }
        ]
      },
      {
        id: 'make',
        name: 'Make.com',
        description: 'Visual workflow builder. Easier than n8n, but more expensive at scale.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: '1,000 operations/month free.',
        tiers: [
          { name: 'Free', price: 0, features: ['1k Ops/mo', '2 Active Scenarios'], isFree: true, limits: 'Basic apps only' },
          { name: 'Core', price: 10.59, features: ['10k Ops/mo', 'Unlimited Scenarios'], limits: 'Billed annually or $10.59/mo' },
          { name: 'Pro', price: 18.82, features: ['Custom Vars', 'Priority Support'], limits: 'Better error handling' }
        ]
      }
    ]
  },
  {
    id: 'media',
    name: 'Media Generation',
    description: 'APIs to create visual assets on demand.',
    category: 'Creative',
    subItems: [
      {
        id: 'fal-ai',
        name: 'Fal.ai / Replicate',
        description: 'Lightning fast serverless inference for Stable Diffusion, Flux, and more.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: 'Trial credits available.',
        payAsYouGoDetails: '~$0.002–0.04 per image, GPU-seconds (H100 ~$1.89/hr).',
        slider: { 
          min: 0, 
          max: 10000, 
          step: 100, 
          unit: 'Images', 
          multiplier: 0.02,
          baTranslation: { multiplier: 1, humanUnit: 'Ad Creatives', roiMultiplier: 0.5, roiUnit: 'Design Hours Saved' }
        }
      },
      {
        id: 'google-veo',
        name: 'Google Veo / Runway',
        description: 'High-end AI Video Generation.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: 'Trial credits available.',
        payAsYouGoDetails: 'Veo: ~$0.15–0.60 per sec. Runway: ~$12–15/mo for 625 credits.',
        slider: { 
          min: 0, 
          max: 1000, 
          step: 10, 
          unit: 'Seconds', 
          multiplier: 0.35,
          baTranslation: { multiplier: 0.16, humanUnit: '10s Social Videos', roiMultiplier: 50, roiUnit: 'Video Prod. Savings ($)' }
        }
      },
      {
        id: 'heygen',
        name: 'HeyGen API',
        description: 'AI Avatars and video lip-syncing generation.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: 'Trial credits available.',
        payAsYouGoDetails: '~$0.50–0.99 per credit (1 credit ≈ 1 min avatar video).',
        tiers: [
          { name: 'Creator', price: 29, features: ['15 Credits/mo', 'Fast Processing'], limits: '1 credit = 1 min of video' },
          { name: 'Business', price: 89, features: ['30 Credits/mo', 'API Access'], limits: 'Required for API integration' },
          { name: 'Pro', price: 99, features: ['Custom Avatars', 'High Priority'], limits: 'Enterprise grade' }
        ]
      }
    ]
  },
  {
    id: 'crm',
    name: 'CRM & Sales Operations',
    description: 'Platforms to manage customer lifecycles. (Prices per user/month)',
    category: 'Sales',
    subItems: [
      {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Enterprise-grade all-in-one CRM. Powerful but expensive.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: 'Free CRM forever (limited contacts/features).',
        payAsYouGoDetails: 'Per hub costs scale significantly.',
        tiers: [
          { name: 'Free', price: 0, features: ['Contact Management', 'Basic Email'], isFree: true, limits: 'HubSpot branding' },
          { name: 'Starter', price: 20, features: ['Remove Branding', 'Basic Automation'], limits: 'Per seat' },
          { name: 'Professional', price: 800, features: ['Omnichannel', 'Advanced Workflows'], limits: 'Per hub/mo' }
        ]
      },
      {
        id: 'gohighlevel',
        name: 'GoHighLevel',
        description: 'The "Agency" CRM. Unlimited sub-accounts for a flat fee.',
        pricingType: 'tiers',
        hasFreeTier: false,
        payAsYouGoDetails: 'Twilio/Email rebilling applies to usage.',
        tiers: [
          { name: 'Starter', price: 97, features: ['1 Account', 'All Core Tools'], limits: 'Single business' },
          { name: 'Unlimited', price: 297, features: ['Unlimited Sub-accounts', 'API Access'], limits: 'Best for agencies' }
        ]
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'High-end corporate CRM for complex data structures.',
        pricingType: 'tiers',
        hasFreeTier: false,
        payAsYouGoDetails: 'No real free tier. Strict per user/month billing.',
        tiers: [
          { name: 'Essentials', price: 25, features: ['Basic CRM', 'Setup'], limits: 'Per user/mo' },
          { name: 'Professional', price: 80, features: ['Complete CRM', 'API Access'], limits: 'Per user/mo' },
          { name: 'Enterprise', price: 170, features: ['Advanced Customization', 'Integration'], limits: 'Per user/mo' }
        ]
      },
      {
        id: 'pipedrive',
        name: 'Pipedrive',
        description: 'Sales-focused CRM with a clean API.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: 'Free 14-day trial.',
        tiers: [
          { name: 'Essentials', price: 14, features: ['Deal Management', 'Basic API'], limits: 'Per user/mo' },
          { name: 'Advanced', price: 29, features: ['Email Sync', 'Automations'], limits: 'Per user/mo' }
        ]
      }
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Outbound',
    description: 'Infrastructure for reaching the end-user.',
    category: 'Outbound',
    subItems: [
      {
        id: 'whatsapp',
        name: 'WhatsApp Business API (Meta)',
        description: 'Official channel for automated chat. Billed per conversation (24h window).',
        pricingType: 'slider',
        hasFreeTier: false,
        payAsYouGoDetails: '$0.005–0.06 per 24h session (varies by country/category).',
        slider: { 
          min: 0, 
          max: 10000, 
          step: 100, 
          unit: 'Conversations', 
          multiplier: 0.03,
          baTranslation: { multiplier: 1, humanUnit: 'Direct Client Engagements', roiMultiplier: 30, roiUnit: '% Open Rate Lift' }
        }
      },
      {
        id: 'resend',
        name: 'Resend (Email API)',
        description: 'Modern, developer-friendly email sending API.',
        pricingType: 'tiers',
        hasFreeTier: true,
        freeTierDetails: '3,000 emails/mo free (100/day limit).',
        payAsYouGoDetails: 'Overage $0.90/1k emails.',
        tiers: [
          { name: 'Free', price: 0, features: ['3k emails/mo', '1 Domain'], isFree: true, limits: '100 emails/day' },
          { name: 'Pro (50k)', price: 20, features: ['50k emails/mo', 'Unlimited Domains'], limits: 'Overage $0.90/1k' },
          { name: 'Scale (100k)', price: 90, features: ['100k emails/mo', 'Dedicated IP'], limits: 'Volume scale' }
        ]
      },
      {
        id: 'sendgrid',
        name: 'SendGrid (Twilio)',
        description: 'Reliable high-volume transactional email.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: '100 emails/day.',
        payAsYouGoDetails: '~$0.001/email after free tier.',
        slider: { 
          min: 0, 
          max: 1000, 
          step: 10, 
          unit: 'k Emails', 
          multiplier: 1.00,
          baTranslation: { multiplier: 1, humanUnit: 'k Deliveries', roiMultiplier: 2, roiUnit: 'Avg. Conversions' }
        }
      }
    ]
  },
  {
    id: 'enrichment',
    name: 'Data Enrichment & Scrapers',
    description: 'APIs to "find" information outside your system.',
    category: 'Enrichment',
    subItems: [
      {
        id: 'proxycurl',
        name: 'Proxycurl (LinkedIn DB)',
        description: 'Specialized API for pulling rich LinkedIn profiles and company data.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: 'Trial credits available.',
        payAsYouGoDetails: 'LinkedIn profile/company enrich ~few credits each (credits bought in packs).',
        slider: { 
          min: 100, 
          max: 10000, 
          step: 100, 
          unit: 'Requests', 
          multiplier: 0.01,
          baTranslation: { multiplier: 1, humanUnit: 'Verified B2B Leads', roiMultiplier: 5, roiUnit: 'Hours of Manual Research Saved' }
        }
      },
      {
        id: 'serper',
        name: 'Serper.dev (Google Search)',
        description: 'Ultra-fast Google Search API to feed real-time web data to your LLMs.',
        pricingType: 'slider',
        hasFreeTier: true,
        freeTierDetails: '2,500 free queries upon sign up.',
        payAsYouGoDetails: '~$0.001–0.003 per query (very cheap packs from $50/5k searches).',
        slider: { 
          min: 0, 
          max: 100, 
          step: 1, 
          unit: 'k Queries', 
          multiplier: 1.00,
          baTranslation: { multiplier: 1, humanUnit: 'k Live Data Injections', roiMultiplier: 99, roiUnit: '% Reduction in Hallucinations' }
        }
      }
    ]
  }
];
