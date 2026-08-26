import { createFileRoute } from "@tanstack/react-router";
import { Clock, Plus, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/lib/cart";
import { FOOD_PARTNERS } from "@/lib/food";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/food-ordering")({
  head: () => ({
    meta: [
      { title: "Food Ordering — Beauty Bloom" },
      { name: "description", content: "Order KFC, McDonald's, Burger King, The Poke Co. or Hungry Lion during your appointment." },
      { property: "og:title", content: "Food Ordering — Beauty Bloom" },
      { property: "og:description", content: "Order KFC, McDonald's, Burger King, The Poke Co. or Hungry Lion during your appointment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const rand = (n: number) => `R${n.toFixed(2)}`;

function Page() {
  const { t } = useI18n();
  const { add } = useCart();

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {t("food.title")}
        </p>
        <h1 className="text-3xl font-bold">{t("food.sub")}</h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Pick a delivery time in your cart at checkout — the salon places the order for you and the
          cost is added to your appointment payment.
        </p>
      </header>

      <Tabs defaultValue={FOOD_PARTNERS[0]!.slug}>
        <TabsList className="flex h-auto flex-wrap justify-start">
          {FOOD_PARTNERS.map((p) => (
            <TabsTrigger key={p.slug} value={p.slug}>
              {p.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {FOOD_PARTNERS.map((p) => (
          <TabsContent key={p.slug} value={p.slug} className="space-y-4">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <Badge variant="secondary">{p.tagline}</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.menu.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="font-semibold">{rand(item.price)}</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        add({
                          id: `food-${item.id}`,
                          serviceId: null,
                          name: `${p.name} — ${item.name}`,
                          price: item.price,
                          kind: "food",
                        });
                        toast.success(`${item.name} added to cart`);
                      }}
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
