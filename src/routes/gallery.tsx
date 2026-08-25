import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Beauty Bloom" },
      { name: "description", content: "Real photos of our salon, services and results." },
      { property: "og:title", content: "Gallery — Beauty Bloom" },
      { property: "og:description", content: "Real photos of our salon, services and results." },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder titleKey="gallery.title" subKey="gallery.sub" />;
}
