export interface MenuItem {
  name: string;
  description: string;
  imagePath: string;
}

// Owner-supplied menu (CONTENT.md §4). TODO: photos still pending — styled
// placeholder thumbs show until imagePath assets are added. Descriptions are
// owner's words, lightly cleaned; flag if a longer copy pass is wanted.
export const menuHighlights: MenuItem[] = [
  {
    name: "Carne Asada",
    description: "Our special blend of tri-tip, brisket, and chuck.",
    imagePath: "/images/menu-carne-asada.svg",
  },
  {
    name: "Al Pastor",
    description: "Marinated pork.",
    imagePath: "/images/menu-al-pastor.svg",
  },
  {
    name: "Chorizo",
    description: "Locally sourced.",
    imagePath: "/images/menu-chorizo.svg",
  },
  {
    name: "Pollo Asada",
    description: "Grilled chicken.",
    imagePath: "/images/menu-pollo-asada.svg",
  },
  {
    name: "Birria",
    description: "Slow-stewed beef in our family chile broth. Served with consomé for dipping.",
    imagePath: "/images/menu-birria.svg",
  },
  {
    name: "Barbacoa",
    description: "Super tender stewed cabeza, cachete, and labio.",
    imagePath: "/images/menu-barbacoa.svg",
  },
  {
    name: "Shrimp",
    description: "Grilled shrimp — also available spicy, cooked with our homemade salsa.",
    imagePath: "/images/menu-shrimp.svg",
  },
];
