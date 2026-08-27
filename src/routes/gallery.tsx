import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  Facebook,
  ImagePlus,
  Instagram,
  Mail,
  Music2,
  Phone,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery & Slideshow — Beauty Bloom" },
      { name: "description", content: "Browse the Beauty Bloom slideshow: services catalogue, contact details, trading hours and our social channels." },
      { property: "og:title", content: "Gallery & Slideshow — Beauty Bloom" },
      { property: "og:description", content: "Browse the Beauty Bloom slideshow: services catalogue, contact details, trading hours and our social channels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const SLIDE_COUNT = 4;

function Page() {
  const { t } = useI18n();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % SLIDE_COUNT), 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {t("gallery.title")}
        </p>
        <h1 className="text-3xl font-bold">{t("gallery.sub")}</h1>
      </header>

      <section
        aria-label="Beauty Bloom slideshow"
        className="petal-gradient overflow-hidden rounded-2xl border border-border"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="rise-anime min-h-[320px] p-6 sm:p-10" key={slide}>
          {slide === 0 && (
            <div className="space-y-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Services catalogue</h2>
              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>Hair — cuts, colour, braids, treatments</li>
                <li>Nails — gel, acrylic, manicure & pedicure</li>
                <li>Lashes — classic, hybrid and volume sets</li>
                <li>Skin — facials, peels and brow shaping</li>
                <li>Free tea, coffee, hot chocolate, water & biscuits</li>
                <li>In-salon food ordering from five partners</li>
              </ul>
              <Button asChild>
                <Link to="/services">Browse all services</Link>
              </Button>
            </div>
          )}

          {slide === 1 && (
            <div className="space-y-4">
              <Phone className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Contact details</h2>
              <div className="space-y-2 text-sm">
                <a href="tel:+27821234567" className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4" /> +27 82 123 4567
                </a>
                <a
                  href="mailto:hello@beautybloom.co.za"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Mail className="h-4 w-4" /> hello@beautybloom.co.za
                </a>
                <p className="text-muted-foreground">Cape Town, South Africa</p>
              </div>
            </div>
          )}

          {slide === 2 && (
            <div className="space-y-4">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">{t("hours.title")}</h2>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>{t("hours.week")}</li>
                <li>{t("hours.sat")}</li>
                <li>{t("hours.sun")}</li>
              </ul>
            </div>
          )}

          {slide === 3 && (
            <div className="space-y-4">
              <Instagram className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Follow Beauty Bloom</h2>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer noopener">
                    <Facebook className="h-4 w-4" /> Facebook
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer noopener">
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer noopener">
                    <Music2 className="h-4 w-4" /> TikTok
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 pb-5">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={slide === i}
              onClick={() => setSlide(i)}
              className={`h-2.5 rounded-full transition-all ${
                slide === i ? "w-6 bg-primary" : "w-2.5 bg-primary/30"
              }`}
            />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <ImagePlus className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Salon photo gallery</CardTitle>
          <CardDescription>
            This gallery is reserved for real photographs of the salon and client results — no
            AI-generated imagery. Send your photos to hello@beautybloom.co.za and we will place them
            here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Salon interior", "Hair & braids", "Nails & lashes"].map((label) => (
              <div
                key={label}
                className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground"
              >
                {label} — photo coming soon
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
