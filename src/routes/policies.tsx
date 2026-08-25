import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: "Policies — Beauty Bloom" },
      { name: "description", content: "Cancellation, late arrival and fee policies for Beauty Bloom appointments." },
      { property: "og:title", content: "Policies — Beauty Bloom" },
      { property: "og:description", content: "Cancellation, late arrival and fee policies for Beauty Bloom appointments." },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder titleKey="policies.title" subKey="policies.sub" />;
}
