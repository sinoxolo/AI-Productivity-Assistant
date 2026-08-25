import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Clock, Coffee, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listServices } from "@/lib/booking.functions";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Beauty Bloom" },
      {
        name: "description",
        content:
          "Browse hair, nails, lash and skin treatments at Beauty Bloom and add them to your cart with free beverage add-ons.",
      },
      { property: "og:title", content: "Services — Beauty Bloom" },
      {
        property: "og:description",
        content: "Hair, nails, lashes and skin treatments with free beverages and loyalty rewards.",
      },
    ],
  }),
  component: ServicesPage,
});

const rand = (n: number) => `R${Number(n).toFixed(2)}`;

function ServicesPage() {
  const { t, lang } = useI18n();
  const { add } = useCart();
  const fetchServices = useServerFn(listServices);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
  });

  const treatments = (data ?? []).filter((s) => s.kind === "service");
  const beverages = (data ?? []).filter((s) => s.kind === "beverage");
  const categories = [...new Set(treatments.map((s) => s.category))];

  const label = (s: { name: string; name_xh: string | null }) =>
    lang === "xh" && s.name_xh ? s.name_xh : s.name;

  return (
    <div className="rise-anime mx-auto max-w-5xl px-4 py-10 md:px-8">
      <h1 className="text-4xl font-semibold md:text-5xl">{t("services.title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("services.sub")}</p>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading catalogue...</p>}
      {isError && <p className="mt-8 text-sm text-destructive">Could not load the catalogue.</p>}

      {categories.map((category) => (
        <section key={category} className="mt-10">
          <h2 className="text-2xl font-semibold">{category}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {treatments
              .filter((s) => s.category === category)
              .map((s) => (
                <article
                  key={s.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-petal"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{label(s)}</h3>
                    <span className="whitespace-nowrap font-semibold text-primary">{rand(s.price)}</span>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {s.duration_min} min
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        add({
                          id: s.id,
                          serviceId: s.id,
                          name: label(s),
                          price: Number(s.price),
                          kind: "service",
                        });
                        toast.success(`${label(s)} added to cart`);
                      }}
                    >
                      <Plus className="h-4 w-4" /> Add to cart
                    </Button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}

      {beverages.length > 0 && (
        <section className="mt-12 rounded-2xl border border-border petal-gradient p-6 shadow-petal">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <Coffee className="h-5 w-5 text-primary" /> Free beverages & treats
          </h2>
          <p className="mt-2 text-sm text-secondary-foreground">
            Complimentary with every appointment — add them to your booking.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {beverages.map((b) => (
              <Button
                key={b.id}
                variant="secondary"
                size="sm"
                onClick={() => {
                  add({ id: b.id, serviceId: b.id, name: label(b), price: 0, kind: "beverage" });
                  toast.success(`${label(b)} added to cart`);
                }}
              >
                <Plus className="h-4 w-4" /> {label(b)}
                <Badge variant="outline" className="ml-1">
                  Free
                </Badge>
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
