import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export const LOYALTY_THRESHOLD = 10;
export const LOYALTY_RATE = 0.1;
export const CANCELLATION_FEE_RATE = 0.2;
export const CANCELLATION_WINDOW_HOURS = 24;

const cartItemSchema = z.object({
  serviceId: z.string().uuid().nullable(),
  name: z.string().min(1),
  kind: z.string().min(1),
  price: z.number().min(0),
  qty: z.number().int().min(1).max(20),
});

const createBookingSchema = z.object({
  appointmentAt: z.string().min(1),
  notes: z.string().max(500).optional(),
  items: z.array(cartItemSchema).min(1),
});

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const supabasePublic = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const { data, error } = await supabasePublic
    .from("services")
    .select("id, slug, name, name_xh, category, kind, price, duration_min, description")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getLoyalty = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("my_completed_booking_count");
    if (error) throw new Error(error.message);
    const completed = data ?? 0;
    return {
      completed,
      threshold: LOYALTY_THRESHOLD,
      qualifies: completed >= LOYALTY_THRESHOLD,
      rate: LOYALTY_RATE,
    };
  });

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createBookingSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const appointment = new Date(data.appointmentAt);
    if (Number.isNaN(appointment.getTime())) throw new Error("Invalid appointment date.");
    if (appointment.getTime() < Date.now()) throw new Error("Pick a future appointment slot.");

    const day = appointment.getDay();
    const hour = appointment.getHours() + appointment.getMinutes() / 60;
    if (day === 0) throw new Error("We are closed on Sundays.");
    if (day === 6 ? hour < 9 || hour > 17 : hour < 9 || hour > 18) {
      throw new Error("Please choose a time within our trading hours.");
    }

    const { data: completedCount, error: countError } =
      await supabase.rpc("my_completed_booking_count");
    if (countError) throw new Error(countError.message);

    const subtotal = data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const qualifies = (completedCount ?? 0) >= LOYALTY_THRESHOLD;
    const discount = qualifies ? Math.round(subtotal * LOYALTY_RATE * 100) / 100 : 0;
    const total = Math.round((subtotal - discount) * 100) / 100;

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        appointment_at: appointment.toISOString(),
        subtotal,
        discount,
        total,
        notes: data.notes ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { error: itemsError } = await supabase.from("booking_items").insert(
      data.items.map((i) => ({
        booking_id: booking.id,
        service_id: i.serviceId,
        name: i.name,
        kind: i.kind,
        unit_price: i.price,
        qty: i.qty,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);

    return { id: booking.id, subtotal, discount, total, loyaltyApplied: qualifies };
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select(
        "id, appointment_at, status, subtotal, discount, cancellation_fee, total, notes, booking_items(id, name, kind, unit_price, qty)",
      )
      .order("appointment_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("id, appointment_at, status, total")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    if (booking.status !== "confirmed") throw new Error("This booking can no longer be cancelled.");

    const hoursUntil =
      (new Date(booking.appointment_at).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < CANCELLATION_WINDOW_HOURS) {
      throw new Error(
        `Cancellations are only allowed more than ${CANCELLATION_WINDOW_HOURS} hours before your appointment. Please contact the salon.`,
      );
    }

    const fee = Math.round(Number(booking.total) * CANCELLATION_FEE_RATE * 100) / 100;

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: "cancelled", cancellation_fee: fee, cancelled_at: new Date().toISOString() })
      .eq("id", booking.id);
    if (updateError) throw new Error(updateError.message);

    return { id: booking.id, fee };
  });
