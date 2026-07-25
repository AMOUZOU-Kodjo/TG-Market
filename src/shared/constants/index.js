export const APP_NAME = "TG-Market";
export const APP_DESCRIPTION = "La marketplace n°1 au Togo";
export const CURRENCY = "FCFA";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const CITIES = [
  "Lomé",
  "Kara",
  "Sokodé",
  "Kpalimé",
  "Atakpamé",
  "Bassar",
  "Tsévié",
  "Dapaong",
  "Sansanné-Mango",
  "Kandé",
  "Vogan",
  "Notsé",
  "Koumongou",
  "Tchamba",
  "Blitta",
  "Sotouboua",
  "Mango",
  "Bafilo",
  "Kémégré",
  "Aneho",
  "Tabligbo",
  "Yotobé",
  "Glejagba",
  "Kpagouda",
  "Kpékplémi",
  "Togblékoévé",
].sort();

export const PRODUCT_CONDITIONS = [
  {
    value: "new",
    label: "Neuf",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    value: "like_new",
    label: "Comme neuf",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    value: "good",
    label: "Bon état",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    value: "fair",
    label: "État correct",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    value: "poor",
    label: "Usé",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
];

export const CONDITION_MAP = Object.fromEntries(
  PRODUCT_CONDITIONS.map((c) => [c.value, c])
);

export const NAVIGATION = [
  { label: "Accueil", to: "/" },
  { label: "Catégories", to: "/categories" },
  { label: "Annonces", to: "/listings" },
  { label: "Publier", to: "/vendre", authRequired: true },
  { label: "Messages", to: "/messages", authRequired: true },
];

export const FOOTER_LINKS = {
  marketplace: [
    { label: "Comment ça marche", to: "/how-it-works" },
    { label: "Publier une annonce", to: "/vendre" },
    { label: "Catégories", to: "/categories" },
    { label: "Rechercher", to: "/listings" },
  ],
  support: [
    { label: "Centre d'aide", to: "/help" },
    { label: "Contactez-nous", to: "/contact" },
    { label: "Signaler un problème", to: "/report" },
    { label: "FAQ", to: "/faq" },
  ],
  legal: [
    { label: "Conditions d'utilisation", to: "/terms" },
    { label: "Politique de confidentialité", to: "/privacy" },
    { label: "Politique de cookies", to: "/cookies" },
  ],
  company: [
    { label: "À propos", to: "/about" },
    { label: "Carrières", to: "/careers" },
    { label: "Blog", to: "/blog" },
    { label: "Presse", to: "/press" },
  ],
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Plus récent" },
  { value: "oldest", label: "Plus ancien" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "popular", label: "Populaire" },
];

export const ITEMS_PER_PAGE = 20;

export const MAX_IMAGES_PER_LISTING = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const RATING_LABELS = {
  1: "Mauvais",
  2: "Passable",
  3: "Bien",
  4: "Très bien",
  5: "Excellent",
};
