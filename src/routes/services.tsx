import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Beauty Bloom" },
      { name: "description", content: "Browse the Beauty Bloom service catalogue and add treatments to your cart." },
      { property: "og:title", content: "Services — Beauty Bloom" },
      { property: "og:description", content: "Browse the Beauty Bloom service catalogue and add treatments to your cart." },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder titleKey="services.title" subKey="services.sub" />;
}
