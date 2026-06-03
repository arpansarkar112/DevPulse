import { query } from "../../db";
import type { IIssue, IIssueQuery, IIssueUpdate } from "./issues.interface";
import { AppError } from "../../middleware/globalErrorHandler";
import type { JwtPayload } from "../../types";

const ALLOWED_SORTS = ['newest', 'oldest'] as const;
const ALLOWED_TYPES = ['bug', 'feature_request'] as const;
const ALLOWED_STATUSES = ['open', 'in_progress', 'resolved'] as const;

const createIssueIntoDb = async (payload: IIssue) => {
    const { title, description, type, reporter_id } = payload;
    const result = await query(
        `INSERT INTO issues (title, description, type, reporter_id) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [title, description, type, reporter_id]
    );
    return result.rows[0];
};

const getAllIssuesFromDb = async (queryPayload: IIssueQuery) => {
    const sort = queryPayload.sort ?? 'newest';
    const type = queryPayload.type;
    const status = queryPayload.status;

    if (sort && !ALLOWED_SORTS.includes(sort)) {
        throw new AppError("Invalid sort value. Use 'newest' or 'oldest'.", 400);
    }

    if (type && !ALLOWED_TYPES.includes(type)) {
        throw new AppError("Invalid type value. Use 'bug' or 'feature_request'.", 400);
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
        throw new AppError("Invalid status value. Use 'open', 'in_progress', or 'resolved'.", 400);
    }

    let sqlString = 'SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE 1=1';
    const sqlValues: Array<string | number | boolean | null | Date> = [];

    if (type) {
        sqlValues.push(type);
        sqlString += ` AND type = $${sqlValues.length}`;
    }

    if (status) {
        sqlValues.push(status);
        sqlString += ` AND status = $${sqlValues.length}`;
    }

    sqlString += sort === 'oldest'
        ? ' ORDER BY created_at ASC'
        : ' ORDER BY created_at DESC';

    const issuesResult = await query(sqlString, sqlValues);
    const issues = issuesResult.rows;

    if (issues.length === 0) {
        return [];
    }

    const reporterIds = [...new Set(issues.map(issue => issue.reporter_id))];
    const userResult = await query(
        'SELECT id, name, role FROM users WHERE id = ANY($1)',
        [reporterIds]
    );

    const reporters = userResult.rows;

    return issues.map(issue => {
        const reporter = reporters.find(user => user.id === issue.reporter_id);

        const { reporter_id, ...issueData } = issue;

        return {
            ...issueData,
            reporter
        };
    });
};

const getSingleIssueFromDb = async (id: string) => {
    const issueResult = await query('SELECT * FROM issues WHERE id = $1', [id]);
    const issue = issueResult.rows[0];

    if (!issue) return null;

    const userResult = await query(
        'SELECT id, name, role FROM users WHERE id = $1', 
        [issue.reporter_id]
    );
    const reporter = userResult.rows[0];

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporter, 
        created_at: issue.created_at,
        updated_at: issue.updated_at
    };
};

const updateIssueIntoDb = async (
    id: string,
    payload: Partial<IIssueUpdate>,
    actor: JwtPayload | undefined
) => {
    if (!actor) {
        throw new AppError("Unauthorized access.", 401);
    }

    const issueResult = await query('SELECT * FROM issues WHERE id = $1', [id]);
    const existingIssue = issueResult.rows[0];

    if (!existingIssue) {
        throw new AppError("Issue not found", 404);
    }

    const isMaintainer = actor.role === 'maintainer';
    const isOwner = existingIssue.reporter_id === actor.id;

    if (!isMaintainer) {
        if (!isOwner) {
            throw new AppError("Forbidden! You can only update your own issue.", 403);
        }

        if (existingIssue.status !== 'open') {
            throw new AppError("Conflict! You can only update your issue while it is open.", 409);
        }

        if (payload.status !== undefined) {
            throw new AppError("Forbidden! Only maintainers can change issue status.", 403);
        }
    }

    if (!payload.title && !payload.description && !payload.type && !payload.status) {
        throw new AppError("At least one issue field is required for update.", 400);
    }

    const updatableFields: Array<keyof Partial<IIssueUpdate>> = isMaintainer
        ? ['title', 'description', 'type', 'status']
        : ['title', 'description', 'type'];

    const updateParts: string[] = [];
    const updateValues: Array<string | number | boolean | null | Date> = [];

    for (const field of updatableFields) {
        if (payload[field] !== undefined) {
            updateValues.push(payload[field]);
            updateParts.push(`${field} = $${updateValues.length}`);
        }
    }

    if (updateParts.length === 0) {
        throw new AppError("No valid issue fields were provided for update.", 400);
    }

    updateValues.push(id);
    const result = await query(
        `UPDATE issues 
         SET ${updateParts.join(', ')},
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $${updateValues.length}
         RETURNING *`,
        updateValues
    );

    return result.rows[0];
};

const deleteIssueFromDb = async (id: string) => {
    const result = await query('DELETE FROM issues WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
        throw new AppError("Issue not found", 404);
    }

    return result.rows[0];
};

export const issuesService = {
    createIssueIntoDb,
    getAllIssuesFromDb,
    getSingleIssueFromDb,
    updateIssueIntoDb,
    deleteIssueFromDb,
};