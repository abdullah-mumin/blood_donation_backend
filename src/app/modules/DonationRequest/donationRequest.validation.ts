import { z } from "zod";
import { REQUEST_STSTUS } from "./donationRequest.constant";
import { BLOOD_TYPE } from "../User/user.constant";

const createDonationReuqestValidationRequest = z.object({
  body: z.object({
    donorId: z.string({
      required_error: "Donor ID is required",
      invalid_type_error: "Donor ID must be a string",
    }),
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
      })
      .regex(/^\d{11}$/, {
        message:
          "Phone number must be exactly 11 digits long and contain only digits",
      }),
    dateOfDonation: z
      .string({
        required_error: "Date of donation is required",
        invalid_type_error: "Date of donation must be a string",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Date of donation must be in the format YYYY-MM-DD",
      }),
    reason: z.string({
      required_error: "Reason is required",
      invalid_type_error: "Reason must be a string",
    }),
  }),
});

const createDonationReuqestWithUserIDValidationRequest = z.object({
  body: z.object({
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
      })
      .regex(/^\d{11}$/, {
        message:
          "Phone number must be exactly 11 digits long and contain only digits",
      }),
    dateOfDonation: z
      .string({
        required_error: "Date of donation is required",
        invalid_type_error: "Date of donation must be a string",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Date of donation must be in the format YYYY-MM-DD",
      }),
    bloodType: z.enum([...BLOOD_TYPE] as [string, ...string[]], {
      required_error: "Blood type is required",
    }),
    reason: z.string({
      required_error: "Reason is required",
      invalid_type_error: "Reason must be a string",
    }),
  }),
});

const updateDonationStatusValidationStatus = z.object({
  body: z.object({
    status: z.enum([...REQUEST_STSTUS] as [string, ...string[]], {
      required_error: "Status is required",
    }),
  }),
});

export const donationRequestValidation = {
  createDonationReuqestValidationRequest,
  createDonationReuqestWithUserIDValidationRequest,
  updateDonationStatusValidationStatus,
};
