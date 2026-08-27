import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, PartyPopper, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/competitions")({
  head: () => ({
    meta: [
      { title: "Competitions — Beauty Bloom" },
      { name: "description", content: "Enter the Beauty Bloom giveaway for a free full pamper day and see everyone who has entered so far." },
      { property: "og:title", content: "Competitions — Beauty Bloom" },
      { property: "og:description", content: "Enter the Beauty Bloom giveaway for a free full pamper day and see everyone who has entered so far." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const SEED_PARTICIPANTS = [
  "Ayanda M.",
  "Chloé v. R.",
  "Nomvula S.",
  "Zinhle K.",
  "Fatima A.",
  "Lerato D.",
  "Michaela P.",
  "Thandiwe N.",
  "Jodie B.",
  "Sibongile T.",
  "Anele Z.",
  "Kirsten L.",
];

function Page() {
  const { t } = useI18n();
  const [participants, setParticipants] = useState<string[]>(SEED_PARTICIPANTS);
  const [entered, setEntered] = useState(false);

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {t("competitions.title")}
        </p>
        <h1 className="text-3xl font-bold">{t("competitions.sub")}</h1>
        <p className="text-sm text-muted-foreground">
          Demo competition — entries are for fun and are not stored or judged.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="petal-gradient rise-anime">
          <CardHeader>
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Win a full pamper day</CardTitle>
            <CardDescription>
              Hair styling, a gel manicure, a classic lash set and a facial — plus lunch from one of
              our food partners. One winner drawn at the salon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="secondary" className="gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> Closes 30 September
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3.5 w-3.5" /> {participants.length} entries
              </Badge>
            </div>

            {entered ? (
              <div className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm">
                <PartyPopper className="h-5 w-5 text-primary" />
                You're on the list! Watch our socials for the draw.
              </div>
            ) : (
              <form
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const name = String(fd.get("name") ?? "").trim();
                  if (!name) return;
                  setParticipants((prev) => [name, ...prev]);
                  setEntered(true);
                  toast.success("Entry added — good luck!");
                }}
              >
                <div className="flex-1 space-y-2">
                  <Label htmlFor="comp-name">Your name</Label>
                  <Input id="comp-name" name="name" placeholder="e.g. Sinoxolo S." required />
                </div>
                <Button type="submit">Enter the draw</Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Participants</CardTitle>
            <CardDescription>Everyone who has entered so far.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="max-h-96 space-y-2 overflow-y-auto pr-1 text-sm">
              {participants.map((p, i) => (
                <li
                  key={`${p}-${i}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                >
                  <span>{p}</span>
                  <span className="text-xs text-muted-foreground">#{participants.length - i}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
