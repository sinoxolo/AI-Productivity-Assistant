import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createAdBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        businessName: z.string().min(1).max(120),
        contactName: z.string().min(1).max(120),
        email: z.string().email().max(200),
        phone: z.string().max(30).optional(),
        startDate: z.string().min(1),
        endDate: z.string().min(1),
        details: z.string().max(1500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const DAILY_RATE = 500;
    const start = new Date(`${data.startDate}T00:00:00`);
    const end = new Date(`${data.endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new Error("Invalid dates.");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) throw new Error("Start date must be in the future.");
    if (end < start) throw new Error("End date must be on or after the start date.");

    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (days > 30) throw new Error("Advertising bookings are limited to 30 days at a time.");
    const total = days * DAILY_RATE;

    const { data: booking, error } = await context.supabase
      .from("ad_bookings")
      .insert({
        user_id: context.userId,
        business_name: data.businessName,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone ?? null,
        start_date: data.startDate,
        end_date: data.endDate,
        days,
        daily_rate: DAILY_RATE,
        total,
        details: data.details ?? null,
      })
      .select("id, days, total")
      .single();
    if (error) throw new Error(error.message);
    return booking;
  });
