export interface MenuItem {
  name: string;
  description: string;
  imagePath: string;
}

// The meat choices ("Pick your meat"): each one goes in any taco, burrito, torta, etc.
// Dishes built on one meat (Quesabirria, Crispy Barbacoa Taco) live in fullMenu instead.
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
    description: "Slow-stewed beef in our family chile broth.",
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
  /**
   * Square's name, set only when the site shows a different one (a rename not yet made in
   * Square). tests/unit/menu.test.ts matches the catalog on it.
   */
  squareName?: string;
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
// Names keep Square's spelling so they match the Cash App order page, unless `squareName`
// is set: that marks a site-side rename the owners still have to make in Square. Descriptions are
// Square's, lightly tightened. No prices on purpose: Cash App (business.orderUrl) is the
// source of truth for those. To re-sync, re-export from Square, apply the filter described
// in BACKLOG B-6, and update this list by hand; tests/unit/menu.test.ts fails until every
// CSV row is accounted for. The test reads the file named in its CSV_PATH, so either
// overwrite that CSV or update CSV_PATH when the new export lands.
export const fullMenu: MenuCategory[] = [
  {
    square: "Main",
    title: "Mains",
    items: [
      {
        name: "Taco",
        description:
          "Street style: two small tortillas with your choice of meat. Chuy's style: two larger tortillas with melted cheese between them, plus extra meat, avocado, sour cream, and queso fresco.",
      },
      {
        name: "Burrito",
        description:
          "Rice, beans, seasoned meat, and cheese in a 12-inch tortilla. Chuy's style goes up to a 14-inch tortilla and adds avocado, sour cream, and queso fresco.",
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
          "A flour tortilla with melted cheese, griddled golden. Add your choice of meat or vegetables. Chuy's style uses a larger tortilla and adds avocado, queso fresco, and sour cream.",
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
        name: "Crispy Barbacoa Taco",
        squareName: "Barbacoa Taco",
        description:
          "Barbacoa (cachete, lengua, and labio) in a tortilla grilled crispy, with beef consomé for dipping.",
      },
      {
        name: "Quesataco",
        description: "A crispy tortilla with melted cheese and your choice of meat, cooked golden.",
      },
      {
        name: "Spicy Shrimp Taco",
        description:
          "Grilled shrimp in a spicy red salsa, served Chuy's style on two larger tortillas with melted cheese between them, plus avocado, sour cream, and queso fresco.",
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
      { name: "3 Crispy Barbacoa Taco Plate", squareName: "3 Barbacoa Taco Plate" },
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
