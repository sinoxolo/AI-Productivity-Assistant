import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgePercent, CalendarDays, Megaphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { createAdBooking } from "@/lib/ad.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/advertising")({
  head: () => ({
    meta: [
      { title: "Advertising Bookings — Beauty Bloom" },
      { name: "description", content: "Promote your products inside Beauty Bloom salon — R500 per day including sample distribution." },
      { property: "og:title", content: "Advertising Bookings — Beauty Bloom" },
      { property: "og:description", content: "Promote your products inside Beauty Bloom salon — R500 per day including sample distribution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const rand = (n: number) => `R${n.toFixed(2)}`;

function Page() {
  const { t } = useI18n();
  const submit = useServerFn(createAdBooking);

  const { data: user } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const booking = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const fd = new FormData(form);
      return submit({
        data: {
          businessName: String(fd.get("businessName") ?? ""),
          contactName: String(fd.get("contactName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? "") || undefined,
          startDate: String(fd.get("startDate") ?? ""),
          endDate: String(fd.get("endDate") ?? ""),
          details: String(fd.get("details") ?? "") || undefined,
        },
      });
    },
    onSuccess: (res, form) => {
      form.reset();
      toast.success(`Booked ${res.days} day(s) — total ${rand(Number(res.total))}. We'll confirm shortly.`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-10 p-4 sm:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {t("ads.title")}
        </p>
        <h1 className="text-3xl font-bold">{t("ads.sub")}</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <BadgePercent className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">R500 per day</CardTitle>
            <CardDescription>Flat daily rate for in-salon promotion</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Megaphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Sample distribution</CardTitle>
            <CardDescription>Hand out samples to salon clients during your booking</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CalendarDays className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Flexible dates</CardTitle>
            <CardDescription>Book a single day or a run of up to 30 days</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Book your advertising days</h2>
        {user ? (
          <Card className="max-w-2xl">
            <CardContent className="pt-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  booking.mutate(e.currentTarget);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business name</Label>
                    <Input id="businessName" name="businessName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact person</Label>
                    <Input id="contactName" name="contactName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start date</Label>
                    <Input id="startDate" name="startDate" type="date" min={today} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End date</Label>
                    <Input id="endDate" name="endDate" type="date" min={today} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">What will you be promoting?</Label>
                  <Textarea
                    id="details"
                    name="details"
                    rows={4}
                    placeholder="Products, samples, setup needs…"
                  />
                </div>
                <Button type="submit" disabled={booking.isPending}>
                  {booking.isPending ? "Booking…" : "Book advertising"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl">
            <CardContent className="flex flex-col items-start gap-3 pt-6">
              <p className="text-sm text-muted-foreground">
                Sign in to book advertising days for your business.
              </p>
              <Button asChild>
                <Link to="/auth">Sign in to advertise</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
