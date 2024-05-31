"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationRequestValidation = void 0;
const zod_1 = require("zod");
const donationRequest_constant_1 = require("./donationRequest.constant");
const createDonationReuqestValidationRequest = zod_1.z.object({
    body: zod_1.z.object({
        donorId: zod_1.z.string({
            required_error: "Donor ID is required",
            invalid_type_error: "Donor ID must be a string",
        }),
        phoneNumber: zod_1.z
            .string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string",
        })
            .regex(/^\d{11}$/, {
            message: "Phone number must be exactly 11 digits long and contain only digits",
        }),
        dateOfDonation: zod_1.z
            .string({
            required_error: "Date of donation is required",
            invalid_type_error: "Date of donation must be a string",
        })
            .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Date of donation must be in the format YYYY-MM-DD",
        }),
        hospitalName: zod_1.z.string({
            required_error: "Hospital name is required",
            invalid_type_error: "Hospital name must be a string",
        }),
        hospitalAddress: zod_1.z.string({
            required_error: "Hospital address is required",
            invalid_type_error: "Hospital address must be a string",
        }),
        reason: zod_1.z.string({
            required_error: "Reason is required",
            invalid_type_error: "Reason must be a string",
        }),
    }),
});
const updateDonationStatusValidationStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...donationRequest_constant_1.REQUEST_STSTUS], {
            required_error: "Status is required",
        }),
    }),
});
exports.donationRequestValidation = {
    createDonationReuqestValidationRequest,
    updateDonationStatusValidationStatus,
};
