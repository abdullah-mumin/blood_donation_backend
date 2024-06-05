import { z } from "zod";
import { BLOOD_TYPE } from "./user.constant";

const registrationUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    }),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({
        message: "Email must be a valid email address",
      }),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .max(20, { message: "Password cannot be more than 20 characters" }),
    bloodType: z.enum([...BLOOD_TYPE] as [string, ...string[]], {
      required_error: "Blood type is required",
    }),
    location: z.string({
      required_error: "Location is required",
      invalid_type_error: "Location must be a string",
    }),
    isBloodDonate: z.boolean({
      required_error: "Donation status is required",
      invalid_type_error: "Donation status must be a boolean",
    }),
    age: z
      .number({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number",
      })
      .optional(),
    bio: z
      .string({
        required_error: "Bio is required",
        invalid_type_error: "Bio must be a string",
      })
      .optional(),
    lastDonationDate: z
      .string({
        required_error: "Last donation date is required",
        invalid_type_error: "Last donation date must be a string",
      })
      .optional(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({
        message: "Email must be a valid email address",
      }),
    password: z
      .string({
        required_error: "Password is required!",
        invalid_type_error: "Password must be a String!",
      })
      .max(20, { message: "Password can not be more than 20 characters" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const userValidation = {
  registrationUserValidationSchema,
  loginUserValidationSchema,
  refreshTokenValidationSchema,
};
