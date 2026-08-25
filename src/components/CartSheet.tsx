import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { createBooking } from "@/lib/booking.functions";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

const rand = (n: number) => `R${n.toFixed(2)}`;

export function CartSheet() {
  const { t } = useI18n();
  const { items, remove, clear, count, total } = useCart();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const book = useServerFn(createBooking);

  const checkout = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setOpen(false);
        navigate({ to: "/auth" });
        throw new Error("Please sign in to complete your booking.");
      }
      return book({
        data: {
          appointmentAt: new Date(`${date}T${time}`).toISOString(),
          notes: notes || undefined,
          items: items.map((i) => ({
            serviceId: i.serviceId,
            name: i.name,
            kind: i.kind,
            price: i.price,
            qty: i.qty,
          })),
        },
      });
    },
    onSuccess: (res) => {
      clear();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(
        res.loyaltyApplied
          ? `Booked! Loyalty discount applied — total ${rand(res.total)}`
          : `Booked! Total ${rand(res.total)}`,
      );
      navigate({ to: "/bookings" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const canCheckout = items.length > 0 && Boolean(date) && Boolean(time);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" aria-label={t("cart.label")}>
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">{t("cart.label")}</span>
          {count > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center px-1">{count}</Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("cart.label")}</SheetTitle>
          <SheetDescription>Choose your appointment slot and confirm your booking.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-3 px-4">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">Your cart is empty. Add a service to start.</p>
          )}
          {items.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{i.name}</p>
                <p className="text-xs text-muted-foreground">
                  {i.qty} × {i.price === 0 ? "free" : rand(i.price)}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(i.id)} aria-label="Remove item">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {items.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cart-date">Date</Label>
                  <Input
                    id="cart-date"
                    type="date"
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cart-time">Time</Label>
                  <Input
                    id="cart-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cart-notes">Notes for the salon</Label>
                <Textarea
                  id="cart-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything we should know?"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Mon–Fri 09:00–18:00, Sat 09:00–17:00. Closed Sundays and public holidays.
                Cancellations allowed up to 24 hours before your slot (20% fee).
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3 border-t border-border p-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Subtotal</span>
            <span>{rand(total)}</span>
          </div>
          <Button
            className="w-full"
            disabled={!canCheckout || checkout.isPending}
            onClick={() => checkout.mutate()}
          >
            Confirm booking
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
