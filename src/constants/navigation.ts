export interface NavItem {
  name: string;
  path: string;
  children?: NavItem[];
}

export interface ExploreItem {
  name: string;
  path: string;
  id: string;
}

export const navigationData: NavItem[] = [
  {
    name: "Services",
    path: "/services",
    children: [
      {
        name: "Consultations",
        path: "/services/consultations",
        children: [
          {
            name: "Moving",
            path: "/services/consultations/moving",
            children: [
              {
                name: "Pricing",
                path: "/services/consultations/moving/pricing"
              }
            ]
          },
          {
            name: "Automation",
            path: "/services/consultations/automation",
            children: [
              {
                name: "Chatbot",
                path: "/services/consultations/automation/chatbot"
              },
              {
                name: "Agentic Newsletter Writer and SEO Blogger",
                path: "/services/consultations/automation/newsletter-seo-blogger"
              },
              {
                name: "KRONOS / Agentic CRM Customizer",
                path: "/services/consultations/automation/kronos-agentic-crm-customizer"
              }
            ]
          }
        ]
      }
    ]
  }
];

export const exploreData: ExploreItem[] = [
  { name: "About", path: "/about", id: "about" },
  { name: "Pricing", path: "/pricing", id: "pricing" },
  { name: "Case Studies", path: "/case-studies", id: "case-studies" },
  { name: "Contact", path: "/contact", id: "contact" },
  { name: "Privacy", path: "/privacy", id: "privacy" },
  { name: "Terms", path: "/terms", id: "terms" },
];
