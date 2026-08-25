import { Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export function TopBar() {
  const { t, lang, setLang } = useI18n();
  const { count } = useCart();
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur md:px-6">
      <SidebarTrigger />

      <form
        className="relative flex-1 max-w-xl"
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

        <Button variant="outline" className="relative" aria-label={t("cart.label")}>
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">{t("cart.label")}</span>
          {count > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center px-1">{count}</Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
