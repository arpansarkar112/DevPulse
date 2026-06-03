import type { Request } from "express";
import type { ValidationIssue } from "../../middleware/manualValidation";

const isNonEmptyString = (value: unknown) => typeof value === "string" && value.trim().length > 0;

const validateIssueCreateBody = (req: Request): ValidationIssue[] => {
    const errors: ValidationIssue[] = [];
    const { title, description, type } = req.body ?? {};

    if (!isNonEmptyString(title) || String(title).trim().length > 150) {
        errors.push({ path: "title", message: "Title is required and must be at most 150 characters" });
    }

    if (typeof description !== "string" || description.trim().length < 20) {
        errors.push({ path: "description", message: "Description is required and must be at least 20 characters" });
    }

    if (type !== "bug" && type !== "feature_request") {
        errors.push({ path: "type", message: "Type must be bug or feature_request" });
    }

    return errors;
};

const validateIssueUpdateBody = (req: Request): ValidationIssue[] => {
    const errors: ValidationIssue[] = [];
    const { title, description, type, status } = req.body ?? {};

    const hasAnyField = title !== undefined || description !== undefined || type !== undefined || status !== undefined;

    if (!hasAnyField) {
        errors.push({ path: "body", message: "At least one field is required for update" });
        return errors;
    }

    if (title !== undefined && (!isNonEmptyString(title) || String(title).trim().length > 150)) {
        errors.push({ path: "title", message: "Title must be at most 150 characters" });
    }

    if (description !== undefined && typeof description !== "string") {
        errors.push({ path: "description", message: "Description must be a string" });
    }

    if (description !== undefined && typeof description === "string" && description.trim().length < 20) {
        errors.push({ path: "description", message: "Description must be at least 20 characters" });
    }

    if (type !== undefined && type !== "bug" && type !== "feature_request") {
        errors.push({ path: "type", message: "Type must be bug or feature_request" });
    }

    if (status !== undefined && status !== "open" && status !== "in_progress" && status !== "resolved") {
        errors.push({ path: "status", message: "Status must be open, in_progress, or resolved" });
    }

    return errors;
};

export const issuesValidation = {
    validateIssueCreateBody,
    validateIssueUpdateBody,
};