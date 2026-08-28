import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileSchema = z.object({
  fullName: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(30).optional(),
});

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, created_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);

    return {
      id: userId,
      email: (claims as { email?: string }).email ?? null,
      fullName: data?.full_name ?? "",
      phone: data?.phone ?? "",
      memberSince: data?.created_at ?? null,
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        full_name: data.fullName?.length ? data.fullName : null,
        phone: data.phone?.length ? data.phone : null,
      },
      { onConflict: "id" },
    );
    if (error) throw new Error(error.message);

    return { ok: true };
  });
