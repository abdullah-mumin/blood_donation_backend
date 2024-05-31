"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const registrationUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
            .email({
            message: "Email must be a valid email address",
        }),
        password: zod_1.z
            .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        })
            .max(20, { message: "Password cannot be more than 20 characters" }),
        bloodType: zod_1.z.enum([...user_constant_1.BLOOD_TYPE], {
            required_error: "Blood type is required",
        }),
        location: zod_1.z.string({
            required_error: "Location is required",
            invalid_type_error: "Location must be a string",
        }),
        age: zod_1.z.number({
            required_error: "Age is required",
            invalid_type_error: "Age must be a number",
        }),
        bio: zod_1.z.string({
            required_error: "Bio is required",
            invalid_type_error: "Bio must be a string",
        }),
        lastDonationDate: zod_1.z.string({
            required_error: "Last donation date is required",
            invalid_type_error: "Last donation date must be a string",
        }),
    }),
});
const loginUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
            .email({
            message: "Email must be a valid email address",
        }),
        password: zod_1.z
            .string({
            required_error: "Password is required!",
            invalid_type_error: "Password must be a String!",
        })
            .max(20, { message: "Password can not be more than 20 characters" }),
    }),
});
exports.userValidation = {
    registrationUserValidationSchema,
    loginUserValidationSchema,
};
