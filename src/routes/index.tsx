import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Coffee, Gift } from "lucide-react";

import logo from "@/assets/beauty-bloom-logo.png";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beauty Bloom Salon — Hair, Nails & Skin in Cape Town" },
      {
        name: "description",
        content:
          "Book hair, nails, lashes and skin treatments at Beauty Bloom. Free beverages, in-salon food ordering and loyalty rewards.",
      },
      { property: "og:title", content: "Beauty Bloom Salon" },
      {
        property: "og:description",
        content: "Book beauty treatments with free beverages, food ordering and loyalty rewards.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();

  return (
    <div className="rise-anime">
      <section className="petal-gradient border-b border-border px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <img
            src={logo}
            alt="Beauty Bloom logo with a pink rose"
            width={1152}
            height={576}
            className="h-24 w-auto md:h-32"
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {t("home.eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground md:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{t("home.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/services">{t("home.book")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/gallery">{t("home.browse")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-12 md:grid-cols-3 md:px-8">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-petal">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="mt-3 text-xl font-semibold">{t("hours.title")}</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>{t("hours.week")}</li>
            <li>{t("hours.sat")}</li>
            <li>{t("hours.sun")}</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-border bg-card p-6 shadow-petal">
          <Coffee className="h-5 w-5 text-primary" />
          <h2 className="mt-3 text-xl font-semibold">Free beverages</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tea, coffee, hot chocolate, water and biscuits with every appointment.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-6 shadow-petal">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="mt-3 text-xl font-semibold">Loyalty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            10% off automatically after 10 completed bookings.
          </p>
        </article>
      </section>
    </div>
  );
}
