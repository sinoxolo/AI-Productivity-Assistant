import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/advertising")({
  head: () => ({
    meta: [
      { title: "Advertising Bookings — Beauty Bloom" },
      { name: "description", content: "Promote and sample your products in-salon for R500 per day." },
      { property: "og:title", content: "Advertising Bookings — Beauty Bloom" },
      { property: "og:description", content: "Promote and sample your products in-salon for R500 per day." },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder titleKey="ads.title" subKey="ads.sub" />;
}
