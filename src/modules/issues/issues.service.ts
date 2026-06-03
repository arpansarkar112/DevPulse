import { query } from "../../db";
import type { IIssue } from "./issues.interface";

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

const getAllIssuesFromDb = async () => {
    const issuesResult = await query('SELECT * FROM issues');
    const issues = issuesResult.rows;

    if (issues.length === 0) return [];

    const reporterIds = [...new Set(issues.map(issue => issue.reporter_id))];
    const usersResult = await query(
        'SELECT id, name, role FROM users WHERE id = ANY($1)',
        [reporterIds]
    );
    const users = usersResult.rows;

    const formattedIssues = issues.map(issue => {
        
        const matchedUser = users.find(user => user.id === issue.reporter_id);

        const { reporter_id, ...issueData } = issue;

        return {
            ...issueData,
            reporter: matchedUser 
        };
    });

    return formattedIssues;
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

export const issuesService = {
    createIssueIntoDb,
    getAllIssuesFromDb,
    getSingleIssueFromDb,
};