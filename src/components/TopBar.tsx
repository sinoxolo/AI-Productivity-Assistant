import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, LogOut, Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/CartSheet";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export function TopBar() {
  const { t, lang, setLang } = useI18n();
  const [query, setQuery] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur md:px-6">
      <SidebarTrigger />

      <form
        className="relative max-w-md flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          toast(query ? `Searching "${query}"` : t("search.placeholder"));
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="pl-9"
          aria-label={t("search.placeholder")}
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="flex items-center rounded-full border border-border bg-card p-0.5"
          role="group"
          aria-label={t("lang.label")}
        >
          {(["en", "xh"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors ${
                lang === l
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l === "en" ? "EN" : "XH"}
            </button>
          ))}
        </div>

        <CartSheet />

        {signedIn ? (
          <>
            <Button asChild variant="ghost" size="icon" aria-label="My bookings">
              <Link to="/bookings">
                <CalendarDays className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button asChild variant="ghost" size="icon" aria-label="Sign in">
            <Link to="/auth">
              <UserRound className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
