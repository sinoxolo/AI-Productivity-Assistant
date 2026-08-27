export const COMMISSION_RATE = 0.15;

export type PartnerShop = {
  slug: string;
  name: string;
  service: string;
  description: string;
  area: string;
  phone: string;
  email: string;
  priceFrom: number;
};

export const PARTNER_SHOPS: PartnerShop[] = [
  {
    slug: "curl-council-barbers",
    name: "Curl Council Barbers",
    service: "Barbering & fades",
    description: "Precision cuts, beard shaping and hot towel shaves for men.",
    area: "Observatory, Cape Town",
    phone: "+27 21 555 0111",
    email: "book@curlcouncil.co.za",
    priceFrom: 180,
  },
  {
    slug: "ink-bloom-tattoo",
    name: "Ink & Bloom Tattoo",
    service: "Tattoo & piercing",
    description: "Fine-line tattoos, cover-ups and sterile piercing studio.",
    area: "Woodstock, Cape Town",
    phone: "+27 21 555 0122",
    email: "hello@inkbloom.co.za",
    priceFrom: 650,
  },
  {
    slug: "serene-spa-massage",
    name: "Serene Spa & Massage",
    service: "Massage & body treatments",
    description: "Deep tissue, hot stone and prenatal massage therapy.",
    area: "Sea Point, Cape Town",
    phone: "+27 21 555 0133",
    email: "spa@serene.co.za",
    priceFrom: 450,
  },
  {
    slug: "bright-smile-dental-aesthetics",
    name: "Bright Smile Aesthetics",
    service: "Teeth whitening",
    description: "Professional whitening and cosmetic smile consultations.",
    area: "Claremont, Cape Town",
    phone: "+27 21 555 0144",
    email: "care@brightsmile.co.za",
    priceFrom: 900,
  },
  {
    slug: "sole-care-podiatry",
    name: "Sole Care Podiatry",
    service: "Medical pedicure",
    description: "Clinical foot care, ingrown nail treatment and orthotics.",
    area: "Rondebosch, Cape Town",
    phone: "+27 21 555 0155",
    email: "feet@solecare.co.za",
    priceFrom: 520,
  },
  {
    slug: "glow-studio-makeup",
    name: "Glow Studio Makeup",
    service: "Bridal & event makeup",
    description: "On-location bridal, matric dance and editorial makeup artistry.",
    area: "Century City, Cape Town",
    phone: "+27 21 555 0166",
    email: "studio@glowmakeup.co.za",
    priceFrom: 750,
  },
];
