"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const statusCode = 400;
    const errorSources = err.issues.map((issue) => {
        return {
            field: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: `${issue === null || issue === void 0 ? void 0 : issue.message}`,
        };
    });
    return {
        statusCode,
        message: "Zod Error!",
        errorDetails: err,
        errorSources,
    };
};
exports.default = handleZodError;
