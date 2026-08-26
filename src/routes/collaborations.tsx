import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Camera, Mail, Phone, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { submitCollabEnquiry } from "@/lib/collab.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/collaborations")({
  head: () => ({
    meta: [
      { title: "Brand Collaborations — Beauty Bloom" },
      { name: "description", content: "Collaborate with Beauty Bloom on social content and campaigns. See our rate card." },
      { property: "og:title", content: "Brand Collaborations — Beauty Bloom" },
      { property: "og:description", content: "Collaborate with Beauty Bloom on social content and campaigns. See our rate card." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const RATE_CARD = [
  { platform: "Facebook", posts: 500, videos: 800 },
  { platform: "Instagram", posts: 600, videos: 900 },
  { platform: "TikTok", posts: null, videos: 700 },
];

const PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
] as const;

function Page() {
  const { t } = useI18n();
  const submit = useServerFn(submitCollabEnquiry);
  const [platforms, setPlatforms] = useState<string[]>([]);

  const { data: user } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const enquiry = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const fd = new FormData(form);
      return submit({
        data: {
          brandName: String(fd.get("brandName") ?? ""),
          contactName: String(fd.get("contactName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? "") || undefined,
          platforms: platforms as ("facebook" | "instagram" | "tiktok")[],
          pkg: String(fd.get("package") ?? ""),
          requirements: String(fd.get("requirements") ?? "") || undefined,
        },
      });
    },
    onSuccess: (_r, form) => {
      form.reset();
      setPlatforms([]);
      toast.success("Enquiry sent! We'll be in touch about your campaign.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-10 p-4 sm:p-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {t("collabs.title")}
        </p>
        <h1 className="text-3xl font-bold">{t("collabs.sub")}</h1>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Rate card</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {RATE_CARD.map((r) => (
            <Card key={r.platform}>
              <CardHeader>
                <CardTitle>{r.platform}</CardTitle>
                <CardDescription>Per campaign post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {r.posts !== null && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <Camera className="h-4 w-4 text-primary" /> Pictures
                    </span>
                    <Badge>R{r.posts}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4 text-primary" /> Videos
                  </span>
                  <Badge>R{r.videos}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Start a collaboration</h2>
        {user ? (
          <Card className="max-w-2xl">
            <CardContent className="pt-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  enquiry.mutate(e.currentTarget);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand name</Label>
                    <Input id="brandName" name="brandName" required />
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
                </div>

                <div className="space-y-2">
                  <Label>Platforms</Label>
                  <div className="flex flex-wrap gap-4">
                    {PLATFORMS.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={platforms.includes(p.id)}
                          onCheckedChange={(checked) =>
                            setPlatforms((prev) =>
                              checked ? [...prev, p.id] : prev.filter((x) => x !== p.id),
                            )
                          }
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Campaign package</Label>
                  <Select name="package" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook-post">Facebook pictures — R500</SelectItem>
                      <SelectItem value="facebook-video">Facebook video — R800</SelectItem>
                      <SelectItem value="instagram-post">Instagram pictures — R600</SelectItem>
                      <SelectItem value="instagram-video">Instagram video — R900</SelectItem>
                      <SelectItem value="tiktok-video">TikTok video — R700</SelectItem>
                      <SelectItem value="multi-platform">Multi-platform campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Campaign requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    placeholder="Tell us about your products, goals and timeline."
                  />
                </div>

                <Button type="submit" disabled={enquiry.isPending || platforms.length === 0}>
                  {enquiry.isPending ? "Sending…" : "Send enquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl">
            <CardContent className="flex flex-col items-start gap-3 pt-6">
              <p className="text-sm text-muted-foreground">
                Sign in to submit a collaboration enquiry and track our reply.
              </p>
              <Button asChild>
                <Link to="/auth">Sign in to collaborate</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact us directly</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="tel:+27821234567" className="flex items-center gap-2 text-primary hover:underline">
            <Phone className="h-4 w-4" /> +27 82 123 4567
          </a>
          <a
            href="mailto:hello@beautybloom.co.za"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Mail className="h-4 w-4" /> hello@beautybloom.co.za
          </a>
        </div>
      </section>
    </div>
  );
}
