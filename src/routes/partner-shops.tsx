import { createFileRoute } from "@tanstack/react-router";
import { Handshake, Mail, MapPin, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { COMMISSION_RATE, PARTNER_SHOPS } from "@/lib/partners";

export const Route = createFileRoute("/partner-shops")({
  head: () => ({
    meta: [
      { title: "Partner Shops — Beauty Bloom" },
      { name: "description", content: "Recommended partner shops offering services beyond our salon — barbering, massage, tattoos, makeup and more." },
      { property: "og:title", content: "Partner Shops — Beauty Bloom" },
      { property: "og:description", content: "Recommended partner shops offering services beyond our salon — barbering, massage, tattoos, makeup and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {t("partners.title")}
        </p>
        <h1 className="text-3xl font-bold">{t("partners.sub")}</h1>
      </header>

      <Card className="border-primary/40 bg-primary/5">
        <CardHeader>
          <Handshake className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">How our referrals work</CardTitle>
          <CardDescription>
            Book and pay these shops directly — they are independent businesses. Beauty Bloom earns a{" "}
            {Math.round(COMMISSION_RATE * 100)}% referral commission from the shop, never from you,
            so your price stays the same. Mention Beauty Bloom when you book.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNER_SHOPS.map((shop) => (
          <Card key={shop.slug} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{shop.name}</CardTitle>
                <Badge variant="secondary">{shop.service}</Badge>
              </div>
              <CardDescription>{shop.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-3 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {shop.area}
              </p>
              <p className="font-semibold">From R{shop.priceFrom}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <a href={`tel:${shop.phone.replace(/\s/g, "")}`}>
                    <Phone className="h-4 w-4" /> Call
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={`mailto:${shop.email}?subject=Booking%20via%20Beauty%20Bloom`}>
                    <Mail className="h-4 w-4" /> Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
