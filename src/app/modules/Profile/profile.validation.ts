import { z } from "zod";

const profilevalidationSchema = z.object({
  body: z.object({
    age: z.number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    }),
    bio: z.string({
      required_error: "Bio is required",
      invalid_type_error: "Bio must be a string",
    }),
    lastDonationDate: z
      .string({
        required_error: "Last donation date is required",
        invalid_type_error: "Last donation date must be a string",
      })
      .optional(),
  }),
});

export const profileValidation = {
  profilevalidationSchema,
};
