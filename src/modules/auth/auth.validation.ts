import type { Request } from "express";
import type { ValidationIssue } from "../../middleware/manualValidation";

const isNonEmptyString = (value: unknown) => typeof value === "string" && value.trim().length > 0;

const isValidEmail = (value: unknown) =>
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const validateRegisterBody = (req: Request): ValidationIssue[] => {
    const errors: ValidationIssue[] = [];
    const { name, email, password, role } = req.body ?? {};

    if (!isNonEmptyString(name)) {
        errors.push({ path: "name", message: "Name is required" });
    }

    if (!isValidEmail(email)) {
        errors.push({ path: "email", message: "A valid email is required" });
    }

    if (typeof password !== "string" || password.length < 6) {
        errors.push({ path: "password", message: "Password must be at least 6 characters long" });
    }

    if (role !== undefined && role !== "contributor" && role !== "maintainer") {
        errors.push({ path: "role", message: "Role must be contributor or maintainer" });
    }

    return errors;
};

const validateLoginBody = (req: Request): ValidationIssue[] => {
    const errors: ValidationIssue[] = [];
    const { email, password } = req.body ?? {};

    if (!isValidEmail(email)) {
        errors.push({ path: "email", message: "A valid email is required" });
    }

    if (typeof password !== "string" || password.trim().length === 0) {
        errors.push({ path: "password", message: "Password is required" });
    }

    return errors;
};

export const authValidation = {
    validateRegisterBody,
    validateLoginBody,
};