import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Sparkles,
  UtensilsCrossed,
  Handshake,
  Megaphone,
  Store,
  ScrollText,
  Images,
  Trophy,
  Phone,
  Mail,
} from "lucide-react";

import logo from "@/assets/beauty-bloom-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const items: { to: string; labelKey: TranslationKey; icon: typeof Home }[] = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/services", labelKey: "nav.services", icon: Sparkles },
  { to: "/food-ordering", labelKey: "nav.food", icon: UtensilsCrossed },
  { to: "/collaborations", labelKey: "nav.collabs", icon: Handshake },
  { to: "/advertising", labelKey: "nav.ads", icon: Megaphone },
  { to: "/partner-shops", labelKey: "nav.partners", icon: Store },
  { to: "/policies", labelKey: "nav.policies", icon: ScrollText },
  { to: "/gallery", labelKey: "nav.gallery", icon: Images },
  { to: "/competitions", labelKey: "nav.competitions", icon: Trophy },
];

export function AppSidebar() {
  const { t } = useI18n();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-3">
        <Link to="/" className="flex items-center justify-center rounded-lg bg-sidebar-accent/40 p-2">
          <img
            src={logo}
            alt="Beauty Bloom logo"
            width={1152}
            height={576}
            className={collapsed ? "h-7 w-7 object-cover object-left" : "h-10 w-auto"}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={t(item.labelKey)}>
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-sidebar-foreground/80">
        {!collapsed && (
          <div className="space-y-2 px-2 pb-2 text-xs">
            <p className="font-medium uppercase tracking-widest text-sidebar-foreground/60">
              {t("nav.contacts")}
            </p>
            <a href="tel:+27821234567" className="flex items-center gap-2 hover:text-sidebar-primary">
              <Phone className="h-3.5 w-3.5" /> +27 82 123 4567
            </a>
            <a
              href="mailto:hello@beautybloom.co.za"
              className="flex items-center gap-2 hover:text-sidebar-primary"
            >
              <Mail className="h-3.5 w-3.5" /> hello@beautybloom.co.za
            </a>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
