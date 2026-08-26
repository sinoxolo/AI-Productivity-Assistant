import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const submitCollabEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        brandName: z.string().min(1).max(120),
        contactName: z.string().min(1).max(120),
        email: z.string().email().max(200),
        phone: z.string().max(30).optional(),
        platforms: z.array(z.enum(["facebook", "instagram", "tiktok"])).min(1),
        pkg: z.string().min(1).max(80),
        requirements: z.string().max(1500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("collab_enquiries").insert({
      user_id: context.userId,
      brand_name: data.brandName,
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone ?? null,
      platforms: data.platforms,
      package: data.pkg,
      requirements: data.requirements ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
