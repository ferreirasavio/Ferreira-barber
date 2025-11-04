import z from "zod";

export const schemaSchedule = z.object({
  name: z.string().min(3),
  phone: z.string().min(10),
  scheduled_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
  type_cut: z.enum(["cabelo", "barba", "cabelo e barba"]),
});

export const schemaScheduleUpdate = schemaSchedule.partial();
