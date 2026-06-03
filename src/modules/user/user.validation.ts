import type { Request } from "express";
import type { ValidationIssue } from "../../middleware/manualValidation";

const isNonEmptyString = (value: unknown) => typeof value === "string" && value.trim().length > 0;

const validateUserUpdateBody = (req: Request): ValidationIssue[] => {
    const errors: ValidationIssue[] = [];
    const { name, role } = req.body ?? {};

    if (name !== undefined && !isNonEmptyString(name)) {
        errors.push({ path: "name", message: "Name cannot be empty" });
    }

    if (role !== undefined && role !== "contributor" && role !== "maintainer") {
        errors.push({ path: "role", message: "Role must be contributor or maintainer" });
    }

    if (name === undefined && role === undefined) {
        errors.push({ path: "body", message: "At least one field is required for update" });
    }

    return errors;
};

export const userValidation = {
    validateUserUpdateBody,
};