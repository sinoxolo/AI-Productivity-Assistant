import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Gift } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cancelBooking, getLoyalty, listMyBookings } from "@/lib/booking.functions";

export const Route = createFileRoute("/_authenticated/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — Beauty Bloom" },
      { name: "description", content: "View, track and cancel your Beauty Bloom appointments." },
      { property: "og:title", content: "My Bookings — Beauty Bloom" },
      { property: "og:description", content: "Track your appointments and loyalty progress." },
    ],
  }),
  component: BookingsPage,
});

const rand = (n: number) => `R${Number(n).toFixed(2)}`;

function BookingsPage() {
  const fetchBookings = useServerFn(listMyBookings);
  const fetchLoyalty = useServerFn(getLoyalty);
  const doCancel = useServerFn(cancelBooking);
  const queryClient = useQueryClient();

  const bookings = useQuery({ queryKey: ["bookings"], queryFn: () => fetchBookings() });
  const loyalty = useQuery({ queryKey: ["loyalty"], queryFn: () => fetchLoyalty() });

  const cancel = useMutation({
    mutationFn: (id: string) => doCancel({ data: { id } }),
    onSuccess: (res) => {
      toast.success(`Booking cancelled. Cancellation fee: ${rand(res.fee)}`);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="rise-anime mx-auto max-w-3xl px-4 py-10 md:px-8">
      <h1 className="text-4xl font-semibold">My bookings</h1>

      <div className="mt-6 rounded-2xl border border-border petal-gradient p-5 shadow-petal">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Gift className="h-4 w-4 text-primary" /> Loyalty rewards
        </div>
        <p className="mt-2 text-sm text-secondary-foreground">
          {loyalty.data
            ? loyalty.data.qualifies
              ? "You qualify for 10% off every booking."
              : `${loyalty.data.completed} of ${loyalty.data.threshold} completed bookings — 10% off unlocks at ${loyalty.data.threshold}.`
            : "Loading your loyalty progress..."}
        </p>
        <Progress
          className="mt-3"
          value={loyalty.data ? Math.min(100, (loyalty.data.completed / loyalty.data.threshold) * 100) : 0}
        />
      </div>

      <div className="mt-8 space-y-4">
        {bookings.isLoading && <p className="text-sm text-muted-foreground">Loading bookings...</p>}
        {bookings.data?.length === 0 && (
          <p className="text-sm text-muted-foreground">No bookings yet — add services to your cart to book.</p>
        )}
        {bookings.data?.map((b) => {
          const hoursUntil = (new Date(b.appointment_at).getTime() - Date.now()) / 3600000;
          return (
            <article key={b.id} className="rounded-2xl border border-border bg-card p-5 shadow-petal">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 font-medium">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {new Date(b.appointment_at).toLocaleString("en-ZA", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <Badge variant={b.status === "cancelled" ? "destructive" : "secondary"}>{b.status}</Badge>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {b.booking_items.map((i) => (
                  <li key={i.id}>
                    {i.qty} × {i.name} — {Number(i.unit_price) === 0 ? "free" : rand(i.unit_price)}
                  </li>
                ))}
              </ul>

              <div className="mt-3 border-t border-border pt-3 text-sm">
                <p>Subtotal: {rand(b.subtotal)}</p>
                {Number(b.discount) > 0 && <p className="text-primary">Loyalty discount: −{rand(b.discount)}</p>}
                {Number(b.cancellation_fee) > 0 && <p>Cancellation fee: {rand(b.cancellation_fee)}</p>}
                <p className="font-semibold">Total: {rand(b.total)}</p>
              </div>

              {b.status === "confirmed" && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={hoursUntil < 24 || cancel.isPending}
                    onClick={() => cancel.mutate(b.id)}
                  >
                    Cancel booking
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {hoursUntil < 24
                      ? "Inside the 24-hour window — please phone the salon."
                      : "Cancelling now attracts a 20% cancellation fee."}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
