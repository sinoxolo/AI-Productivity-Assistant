import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CalendarX, Clock, CreditCard, Handshake } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: "Policies — Beauty Bloom" },
      { name: "description", content: "Cancellation, late arrival, payment and referral policies for Beauty Bloom appointments." },
      { property: "og:title", content: "Policies — Beauty Bloom" },
      { property: "og:description", content: "Cancellation, late arrival, payment and referral policies for Beauty Bloom appointments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const HIGHLIGHTS = [
  {
    icon: CalendarX,
    title: "24-hour cancellation window",
    body: "Cancel online more than 24 hours before your slot. A 20% cancellation fee applies.",
  },
  {
    icon: Clock,
    title: "15-minute grace period",
    body: "Arrive within 15 minutes of your slot. Later than that and we may shorten or reschedule.",
  },
  {
    icon: CreditCard,
    title: "Flexible payment",
    body: "All South African banks, instant EFT, PayFlex, PayJustNow or cash in the salon.",
  },
];

function Page() {
  const { t } = useI18n();

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {t("policies.title")}
        </p>
        <h1 className="text-3xl font-bold">{t("policies.sub")}</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <Card key={h.title}>
            <CardHeader>
              <h.icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{h.title}</CardTitle>
              <CardDescription>{h.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Accordion type="single" collapsible className="max-w-3xl">
        <AccordionItem value="cancellation">
          <AccordionTrigger>Cancellation policy</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              You can cancel an appointment yourself from the My Bookings page, but only while there
              are more than 24 hours left before your slot. A cancellation fee of 20% of the booking
              total is charged to cover the reserved stylist time.
            </p>
            <p>
              Inside the 24-hour window the online cancel button is disabled. Phone the salon on
              +27 82 123 4567 and we will do what we can, but the full booking amount may be due.
            </p>
            <p>No-shows are charged the full booking amount.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="late">
          <AccordionTrigger>Late arrivals</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              We hold your slot for 15 minutes. After that your treatment may be shortened to protect
              the next client's booking, at the full price.
            </p>
            <p>
              More than 30 minutes late is treated as a no-show. Please call ahead if you are running
              behind — we will always try to fit you in.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payments">
          <AccordionTrigger>Payments, fees and loyalty</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              We accept cards from all South African banks, instant EFT, PayFlex (4 interest-free
              instalments), PayJustNow (3 interest-free instalments) and cash.
            </p>
            <p>
              After 10 completed bookings a 10% loyalty discount is applied automatically to every
              future booking total.
            </p>
            <p>
              Food ordered from our partners and in-salon advertising bookings are added to the same
              payment. Beverages (tea, coffee, hot chocolate, water and biscuits) are free.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="referrals">
          <AccordionTrigger>Partner shop referrals</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Partner shops are independent businesses. You book and pay them directly and their
              own terms apply. Beauty Bloom receives a 15% referral commission from the shop, not
              from you.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hours">
          <AccordionTrigger>Trading hours and public holidays</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <p>Monday to Friday: 09:00 – 18:00</p>
            <p>Saturday: 09:00 – 17:00</p>
            <p>Closed on Sundays and all South African public holidays.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="conduct">
          <AccordionTrigger>Health, safety and salon conduct</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Please tell your stylist about allergies, skin sensitivities or pregnancy before your
              treatment starts so we can adjust products.
            </p>
            <p>
              Children must be supervised at all times. We reserve the right to refuse service for
              abusive behaviour.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="max-w-3xl border-primary/40 bg-primary/5">
        <CardHeader>
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Questions about a fee?</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            <Handshake className="h-4 w-4" /> Call +27 82 123 4567 or email hello@beautybloom.co.za
            and we will review it with you.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
