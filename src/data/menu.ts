export interface MenuItem {
  name: string;
  description: string;
  imagePath: string;
}

// Owner-supplied menu. TODO(owner): photos still pending — styled
// placeholder thumbs show until imagePath assets are added. Descriptions are
// owner's words, lightly cleaned; flag if a longer copy pass is wanted.
export const menuHighlights: MenuItem[] = [
  {
    name: "Carne Asada",
    description: "Our special blend of steak, grilled and chopped fresh.",
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
    description: "Super tender stewed cachete, lengua, and labio.",
    imagePath: "/images/menu-barbacoa.svg",
  },
  {
    name: "Shrimp",
    description: "Grilled shrimp — also available spicy, cooked with our homemade salsa.",
    imagePath: "/images/menu-shrimp.svg",
  },
];

export interface FullMenuItem {
  name: string;
  description?: string;
  /** Flavors or brands folded into one line (drinks). */
  options?: string[];
}

export interface MenuCategory {
  /** Category name in the Square catalog; tests/unit/menu.test.ts matches on it. */
  square: string;
  title: string;
  items: FullMenuItem[];
}

// Full menu, hand-copied from docs/menu/square-catalog-2026-11-04.csv (BACKLOG B-6).
// Names keep Square's spelling so they match the Cash App order page. Descriptions are
// Square's, lightly tightened. No prices on purpose: Cash App (business.orderUrl) is the
// source of truth for those. To re-sync, re-export from Square, apply the filter described
// in BACKLOG B-6, and update this list by hand; tests/unit/menu.test.ts fails until every
// CSV row is accounted for.
export const fullMenu: MenuCategory[] = [
  {
    square: "Main",
    title: "Mains",
    items: [
      {
        name: "Taco",
        description:
          "Street-style on a plain tortilla with your choice of meat. Chuy's style doubles the tortillas and adds cheese, extra meat, avocado, sour cream, and queso fresco.",
      },
      {
        name: "Burrito",
        description:
          "Rice, beans, seasoned meat, and cheese. Chuy's style adds avocado, sour cream, and queso fresco.",
      },
      {
        name: "Torta",
        description:
          "Your choice of meat with mayo and melted shredded cheese. Chuy's style adds sour cream, queso fresco, and avocado.",
      },
      {
        name: "Mini Torta",
        description:
          "A daily-baked mini bun with mayo, melted shredded cheese, and your choice of meat.",
      },
      {
        name: "Quesadilla",
        description:
          "A flour tortilla with melted cheese, griddled golden. Add your choice of meat or vegetables.",
      },
      {
        name: "Rice and Bean Bowl",
        description: "Rice and beans with your choice of meat.",
      },
      {
        name: "Rice, Bean, and Cheese Burrito",
        description: "Seasoned rice, beans, and melted cheese in a flour tortilla.",
      },
    ],
  },
  {
    square: "Specialty",
    title: "Specialties",
    items: [
      {
        name: "Quesabirria",
        description:
          "Birria and melted cheese in a crisp, golden tortilla, with consomé for dipping.",
      },
      {
        name: "Barbacoa Taco",
        description: "Slow-cooked cachete, lengua, and labio, with beef consomé for dipping.",
      },
      {
        name: "Quesataco",
        description: "A crispy tortilla with melted cheese and your choice of meat, cooked golden.",
      },
      {
        name: "Spicy Shrimp Taco",
        description: "Grilled shrimp in a spicy red salsa on a soft tortilla, Chuy's style.",
      },
      {
        name: "Breakfast Burrito",
        description:
          "Scrambled eggs, melted cheese, crispy fries, and your choice of ham, bacon, or chorizo in a flour tortilla.",
      },
      {
        name: "Loaded Fries",
        description:
          "Crispy fries topped with avocado, sour cream, queso fresco, shredded Mexican-blend cheese, and your choice of meat.",
      },
      { name: "Surf & Turf Fries" },
      { name: "Chuy's Salad" },
    ],
  },
  {
    square: "Combo",
    title: "Combos",
    items: [
      { name: "4 Tacos + Rice and Bean Combo" },
      { name: "3 Barbacoa Taco Plate" },
      { name: "3 Quesabirria Plate" },
      { name: "Burrito Combo" },
      { name: "Torta Combo" },
      { name: "4 Mini Tortas with Rice and Beans Combo" },
      { name: "Quesadilla Combo" },
    ],
  },
  {
    square: "Sides",
    title: "Sides",
    items: [{ name: "Rice and Bean Side" }, { name: "Side Fries" }],
  },
  {
    square: "Drinks",
    title: "Drinks",
    items: [
      { name: "Agua Fresca" },
      {
        name: "Jarritos",
        options: ["Fruit Punch", "Guava", "Lime", "Mandarin", "Mineragua", "Pineapple", "Tamarind"],
      },
      {
        name: "Canned sodas",
        options: ["Coke", "Coke Zero", "Dr. Pepper", "Pepsi", "Pepsi Zero", "Sprite"],
      },
      {
        name: "Bottled",
        options: ["Coke", "Sprite", "Squirt", "Water", "Gatorade", "Snapple"],
      },
    ],
  },
];
