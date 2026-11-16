import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const appointmentSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(120),
  service_id: z.string().uuid(),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }),
  booking_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/),
  notes: z.string().max(500).optional(),
});

const reviewSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().trim().min(10).max(1000),
});

export const submitAppointment = createServerFn({ method: "POST" })
  .inputValidator((input) => appointmentSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: service, error: serviceError } = await supabaseAdmin
      .from("services")
      .select("id")
      .eq("id", data.service_id)
      .eq("is_active", true)
      .maybeSingle();

    if (serviceError || !service) {
      throw new Error("Please choose an available service and try again.");
    }

    const { error } = await supabaseAdmin.from("appointments").insert({
      customer_name: data.customer_name,
      phone: data.phone,
      email: data.email,
      service_id: data.service_id,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      notes: data.notes ?? null,
    });

    if (error) {
      console.error("Appointment submission failed", error);
      throw new Error("We couldn't send your appointment request. Please try again.");
    }

    return { success: true };
  });

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input) => reviewSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("reviews").insert({
      customer_name: data.customer_name,
      rating: data.rating,
      review_text: data.review_text,
    });

    if (error) {
      console.error("Review submission failed", error);
      throw new Error("We couldn't send your review. Please try again.");
    }

    return { success: true };
  });