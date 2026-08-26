export type FoodPartner = {
  slug: string;
  name: string;
  tagline: string;
  menu: { id: string; name: string; description: string; price: number }[];
};

export const FOOD_PARTNERS: FoodPartner[] = [
  {
    slug: "kfc",
    name: "KFC",
    tagline: "Finger lickin' good",
    menu: [
      { id: "kfc-streetwise2", name: "Streetwise Two", description: "2 pieces chicken + small chips", price: 54.9 },
      { id: "kfc-zinger", name: "Zinger Burger Meal", description: "Zinger burger, chips & drink", price: 74.9 },
      { id: "kfc-twister", name: "Twister", description: "Classic chicken wrap", price: 49.9 },
      { id: "kfc-wings", name: "Hot Wings (4)", description: "4 spicy hot wings", price: 39.9 },
    ],
  },
  {
    slug: "mcdonalds",
    name: "McDonald's",
    tagline: "I'm lovin' it",
    menu: [
      { id: "mcd-bigmac", name: "Big Mac Meal", description: "Big Mac, medium fries & drink", price: 69.9 },
      { id: "mcd-mcfeast", name: "McFeast Meal", description: "McFeast, medium fries & drink", price: 64.9 },
      { id: "mcd-nuggets", name: "Chicken McNuggets (6)", description: "With your choice of dip", price: 44.9 },
      { id: "mcd-cheeseburger", name: "Double Cheeseburger", description: "Two beef patties, double cheese", price: 39.9 },
    ],
  },
  {
    slug: "burger-king",
    name: "Burger King",
    tagline: "Have it your way",
    menu: [
      { id: "bk-whopper", name: "Whopper Meal", description: "Flame-grilled Whopper, fries & drink", price: 79.9 },
      { id: "bk-double", name: "Double Cheeseburger Meal", description: "Double cheeseburger, fries & drink", price: 64.9 },
      { id: "bk-nuggets", name: "Chicken Nuggets (6)", description: "With BBQ or sweet chilli dip", price: 42.9 },
      { id: "bk-onion", name: "Onion Rings", description: "Golden crispy onion rings", price: 29.9 },
    ],
  },
  {
    slug: "poke-co",
    name: "The Poke Co.",
    tagline: "Fresh poke bowls",
    menu: [
      { id: "poke-salmon", name: "Salmon Poke Bowl", description: "Salmon, edamame, avocado, sushi rice", price: 109 },
      { id: "poke-chicken", name: "Teriyaki Chicken Bowl", description: "Teriyaki chicken, slaw, rice", price: 89 },
      { id: "poke-veggie", name: "Veggie Bowl", description: "Tofu, edamame, seasonal greens", price: 79 },
      { id: "poke-mini", name: "Mini Poke", description: "Small bowl, big flavour", price: 59 },
    ],
  },
  {
    slug: "hungry-lion",
    name: "Hungry Lion",
    tagline: "Big on taste",
    menu: [
      { id: "hl-chips", name: "Chunky Chips", description: "Famously big portion of chips", price: 29.9 },
      { id: "hl-burger", name: "Big King Burger Meal", description: "Burger, chips & drink", price: 59.9 },
      { id: "hl-wings", name: "Dunked Wings (4)", description: "Wings dunked in your favourite sauce", price: 44.9 },
      { id: "hl-share", name: "Share Box", description: "Chicken pieces, chips & rolls for two", price: 99.9 },
    ],
  },
];
