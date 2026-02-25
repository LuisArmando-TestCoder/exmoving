export interface NavItem {
  name: string;
  path: string;
  children?: NavItem[];
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
              { name: "Pricing", path: "/services/consultations/moving/pricing" },
            ],
          },
        ],
      },
    ],
  },
];
