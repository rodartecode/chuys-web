export interface MenuItem {
  name: string;
  description: string;
}

// The meat choices ("Pick your meat", below the full menu): each one goes in any taco, burrito, torta, etc.
// Dishes built on one meat (Quesabirria, Crispy Barbacoa Taco) live in fullMenu instead.
// Owner-supplied menu. No photos: Square's photos show dishes, not single meats (see dishPhotos).
// Descriptions are owner's words, lightly cleaned; flag if a longer copy pass is wanted.
export const menuHighlights: MenuItem[] = [
  {
    name: "Carne Asada",
    description: "Our special blend of steak, grilled and chopped fresh.",
  },
  {
    name: "Al Pastor",
    description: "Marinated pork.",
  },
  {
    name: "Chorizo",
    description: "Locally sourced.",
  },
  {
    name: "Pollo Asada",
    description: "Grilled chicken.",
  },
  {
    name: "Birria",
    description: "Slow-stewed beef in our family chile broth.",
  },
  {
    name: "Barbacoa",
    description: "Super tender stewed cachete, lengua, and labio.",
  },
  {
    name: "Shrimp",
    description: "Grilled shrimp — also available spicy, cooked with our homemade salsa.",
  },
];

export interface FullMenuItem {
  name: string;
  /**
   * Square's name, set only when the site shows a different one (a rename not yet made in
   * Square). tests/unit/menu.test.ts matches the catalog on it.
   */
  squareName?: string;
  /**
   * Other Square items this entry stands for and doesn't list separately: the "Chuy's Style" and
   * "Street Style" versions, which the description already covers. tests/unit/menu.test.ts
   * counts them as shown.
   */
  squareVariants?: string[];
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

// Full menu, hand-copied from docs/menu/square-catalog.csv (BACKLOG B-6).
// Names keep Square's spelling so they match the Cash App order page, unless `squareName`
// is set: that marks a site-side rename the owners still have to make in Square. Descriptions are
// Square's, lightly tightened. No prices on purpose: Cash App (business.orderUrl) is the
// source of truth for those. To re-sync, run `pnpm menu:pull` (needs `square auth login`),
// which rewrites the CSV from the live catalog, then update this list by hand;
// tests/unit/menu.test.ts fails until every CSV row is accounted for.
export const fullMenu: MenuCategory[] = [
  {
    square: "Main",
    title: "Mains",
    items: [
      {
        name: "Taco",
        squareVariants: ["Chuy's Style Taco", "Street Style Taco"],
        description:
          "Street style: two small tortillas with your choice of meat. Chuy's style: two larger tortillas with melted cheese between them, plus extra meat, avocado, sour cream, and queso fresco.",
      },
      {
        name: "Burrito",
        squareVariants: ["Chuy's Style Burrito", "Street Style Burrito"],
        description:
          "Rice, beans, seasoned meat, and cheese in a 12-inch tortilla. Chuy's style goes up to a 14-inch tortilla and adds avocado, sour cream, and queso fresco.",
      },
      {
        name: "Torta",
        squareVariants: ["Chuy's Style Torta", "Street Style Torta"],
        description:
          "Your choice of meat with mayo and melted shredded cheese. Chuy's style adds sour cream, queso fresco, and avocado.",
      },
      {
        name: "Mini Torta",
        squareVariants: ["Chuy's Style Mini Torta", "Street Style Mini Torta"],
        description:
          "A daily-baked mini bun with mayo, melted shredded cheese, and your choice of meat.",
      },
      {
        name: "Quesadilla",
        squareVariants: ["Chuy's Style Quesadilla", "Street Style Quesadilla"],
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
      {
        name: "Surf & Turf Fries",
        description:
          "Crispy fries topped with shrimp, your choice of meat, avocado, sour cream, and queso fresco.",
      },
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

export interface DishPhoto {
  /** The `fullMenu` item the photo shows; tests/unit/menu.test.ts checks it exists. */
  dish: string;
  caption: string;
  alt: string;
  /** File name under src/assets/menu/, written by `pnpm menu:photos` (scripts/menu-photos.mjs). */
  file: string;
}

// The photo gallery between the full menu and "Pick your meat". The photos are the owners' own,
// pulled from their Square catalog (they also show on the Cash App order page). Plain strings, no
// image imports, so tests/e2e can load this file in Node; MenuHighlights.astro resolves `file`.
export const dishPhotos: DishPhoto[] = [
  {
    dish: "Taco",
    caption: "Chuy's Style Tacos",
    alt: "Two Chuy's style tacos topped with avocado, sour cream, queso fresco and cilantro, with lime, radish and cucumber",
    file: "chuys-style-tacos.jpg",
  },
  {
    dish: "Taco",
    caption: "Street Tacos",
    alt: "Three street tacos with onion, cilantro and red salsa on checkered paper, with lime, radish and cucumber",
    file: "street-tacos.jpg",
  },
  {
    dish: "Burrito",
    caption: "Burritos",
    alt: "Two foil-wrapped burritos cut open to show rice and meat, with a cup of salsa, grilled jalapeños, avocado, lime and cucumber",
    file: "burrito.jpg",
  },
  {
    dish: "Quesabirria",
    caption: "Quesabirria",
    alt: "A golden, crispy quesabirria stuffed with birria, next to a cup of red consomé for dipping",
    file: "quesabirria.jpg",
  },
  {
    dish: "Crispy Barbacoa Taco",
    caption: "Crispy Barbacoa Tacos",
    alt: "Crispy barbacoa tacos piled with tender shredded beef, with a lidded cup of consomé",
    file: "crispy-barbacoa-taco.jpg",
  },
  {
    dish: "Surf & Turf Fries",
    caption: "Surf & Turf Fries",
    alt: "Fries in a to-go box topped with grilled shrimp, meat, avocado, sour cream, queso fresco and yellow chiles",
    file: "surf-and-turf-fries.jpg",
  },
  {
    dish: "Mini Torta",
    caption: "Mini Torta",
    alt: "A mini torta on a toasted bun, overflowing with meat and melted cheese, with radish, cucumber and cilantro",
    file: "mini-torta.jpg",
  },
  {
    dish: "Breakfast Burrito",
    caption: "Breakfast Burrito",
    alt: "A breakfast burrito cut in half to show scrambled eggs, crispy fries and meat",
    file: "breakfast-burrito.jpg",
  },
];
