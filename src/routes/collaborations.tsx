import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/collaborations")({
  head: () => ({
    meta: [
      { title: "Brand Collaborations — Beauty Bloom" },
      { name: "description", content: "Collaborate with Beauty Bloom on social content and campaigns. See our rate card." },
      { property: "og:title", content: "Brand Collaborations — Beauty Bloom" },
      { property: "og:description", content: "Collaborate with Beauty Bloom on social content and campaigns. See our rate card." },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder titleKey="collabs.title" subKey="collabs.sub" />;
}
