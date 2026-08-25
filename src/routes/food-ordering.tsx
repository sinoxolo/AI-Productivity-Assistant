import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/food-ordering")({
  head: () => ({
    meta: [
      { title: "Food Ordering — Beauty Bloom" },
      { name: "description", content: "Order KFC, McDonald's, Burger King, The Poke Co. or Hungry Lion during your appointment." },
      { property: "og:title", content: "Food Ordering — Beauty Bloom" },
      { property: "og:description", content: "Order KFC, McDonald's, Burger King, The Poke Co. or Hungry Lion during your appointment." },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder titleKey="food.title" subKey="food.sub" />;
}
