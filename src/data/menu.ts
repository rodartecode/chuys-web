export interface MenuItem {
  name: string;
  description: string;
  imagePath: string;
}

// TODO: replace placeholder copy and imagePath values with real content
export const menuHighlights: MenuItem[] = [
  {
    name: "Al Pastor",
    description:
      "Marinated pork shoulder shaved off the trompo, crowned with charred pineapple, onion, and cilantro.",
    imagePath: "/images/menu-al-pastor.svg",
  },
  {
    name: "Carnitas",
    description:
      "Slow-braised pork, crisped on the plancha. Served on a double corn tortilla with salsa verde.",
    imagePath: "/images/menu-carnitas.svg",
  },
  {
    name: "Carne Asada",
    description:
      "Grilled skirt steak marinated in citrus and garlic, finished with onion, cilantro, and lime.",
    imagePath: "/images/menu-carne-asada.svg",
  },
  {
    name: "Pollo Asado",
    description:
      "Achiote-marinated chicken, grilled over an open flame and served with avocado salsa.",
    imagePath: "/images/menu-pollo-asado.svg",
  },
  {
    name: "Birria",
    description: "Slow-stewed beef in our family chile broth. Served with consomé for dipping.",
    imagePath: "/images/menu-birria.svg",
  },
  {
    name: "Veggie",
    description: "Roasted seasonal vegetables, black beans, queso fresco, and house salsa macha.",
    imagePath: "/images/menu-veggie.svg",
  },
];
