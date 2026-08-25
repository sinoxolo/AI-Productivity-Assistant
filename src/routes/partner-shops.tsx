import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/partner-shops")({
  head: () => ({
    meta: [
      { title: "Partner Shops — Beauty Bloom" },
      { name: "description", content: "Recommended partner shops offering services beyond our salon." },
      { property: "og:title", content: "Partner Shops — Beauty Bloom" },
      { property: "og:description", content: "Recommended partner shops offering services beyond our salon." },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder titleKey="partners.title" subKey="partners.sub" />;
}
