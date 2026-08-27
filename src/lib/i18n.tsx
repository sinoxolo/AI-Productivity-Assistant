import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "xh";

const dict = {
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.food": "Food Ordering",
    "nav.collabs": "Collaborations",
    "nav.ads": "Advertising",
    "nav.partners": "Partner Shops",
    "nav.policies": "Policies",
    "nav.gallery": "Gallery",
    "nav.contacts": "Contacts",
    "nav.menu": "Menu",
    "search.placeholder": "Search services, food, shops...",
    "cart.label": "Cart",
    "lang.label": "Language",
    "home.eyebrow": "Beauty salon in Cape Town",
    "home.title": "Bloom into your best self",
    "home.subtitle":
      "Hair, nails, lashes and skin care — with free beverages, food ordering and loyalty rewards.",
    "home.book": "Book an appointment",
    "home.browse": "Browse services",
    "hours.title": "Trading hours",
    "hours.week": "Mon – Fri: 09:00 – 18:00",
    "hours.sat": "Sat: 09:00 – 17:00",
    "hours.sun": "Closed Sundays & public holidays",
    "soon": "Coming in the next build step",
    "services.title": "Services",
    "services.sub": "Our catalogue with add-to-cart booking.",
    "food.title": "Food Ordering",
    "food.sub": "Order from our food partners during your appointment.",
    "collabs.title": "Brand Collaborations",
    "collabs.sub": "Work with Beauty Bloom on content and campaigns.",
    "ads.title": "Advertising Bookings",
    "ads.sub": "Promote your products in-salon at R500 per day.",
    "partners.title": "Partner Shops",
    "partners.sub": "Trusted shops offering services we don't.",
    "policies.title": "Policies",
    "policies.sub": "Cancellations, late arrivals and fees.",
    "gallery.title": "Gallery",
    "gallery.sub": "Real photos from the salon.",
    "nav.competitions": "Competitions",
    "competitions.title": "Competitions",
    "competitions.sub": "Enter our giveaway and see who else is in.",
  },
  xh: {
    "nav.home": "Ikhaya",
    "nav.services": "Iinkonzo",
    "nav.food": "Ukuodola Ukutya",
    "nav.collabs": "Intsebenziswano",
    "nav.ads": "Intengiso",
    "nav.partners": "Iivenkile Ezisebenzisanayo",
    "nav.policies": "Imigaqo",
    "nav.gallery": "Igalari",
    "nav.contacts": "Iinkcukacha",
    "nav.menu": "Imenyu",
    "search.placeholder": "Khangela iinkonzo, ukutya, iivenkile...",
    "cart.label": "Ingxowa",
    "lang.label": "Ulwimi",
    "home.eyebrow": "Isaluni yobuhle eKapa",
    "home.title": "Tyatyamba ube ngcono",
    "home.subtitle":
      "Iinwele, iinzipho, iintshiyi kunye nolusu — kunye neziselo simahla, ukuodola ukutya nemivuzo.",
    "home.book": "Bhukisha idinga",
    "home.browse": "Jonga iinkonzo",
    "hours.title": "Iiyure zokusebenza",
    "hours.week": "Mvulo – Lwesihlanu: 09:00 – 18:00",
    "hours.sat": "Mgqibelo: 09:00 – 17:00",
    "hours.sun": "Ivalwe ngeCawa nangeeholide zikawonke-wonke",
    "soon": "Iza kwinyathelo elilandelayo",
    "services.title": "Iinkonzo",
    "services.sub": "Uluhlu lweenkonzo zethu nokubhukisha.",
    "food.title": "Ukuodola Ukutya",
    "food.sub": "Odola ukutya ngexesha ledinga lakho.",
    "collabs.title": "Intsebenziswano Neempawu",
    "collabs.sub": "Sebenza neBeauty Bloom kumkhankaso wakho.",
    "ads.title": "Ukubhukisha Intengiso",
    "ads.sub": "Thengisa iimveliso zakho esaluni nge-R500 ngosuku.",
    "partners.title": "Iivenkile Ezisebenzisanayo",
    "partners.sub": "Iivenkile ezithembekileyo zeenkonzo esingazenzi.",
    "policies.title": "Imigaqo",
    "policies.sub": "Ukurhoxisa, ukufika emva kwexesha nemirhumo.",
    "gallery.title": "Igalari",
    "gallery.sub": "Iifoto zokwenene zesaluni.",
  },
} as const;

export type TranslationKey = keyof (typeof dict)["en"];

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TranslationKey) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("bb-lang");
    if (stored === "en" || stored === "xh") setLang(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("bb-lang", lang);
  }, [lang]);

  const t = (k: TranslationKey) => dict[lang][k] ?? dict.en[k];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
