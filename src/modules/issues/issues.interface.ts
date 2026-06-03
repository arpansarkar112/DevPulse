export interface IIssue {
    title: string;
    description: string;
    type: 'bug' | 'feature_request';
    reporter_id: number;
}

export interface IIssueUpdate {
    title?: string;
    description?: string;
    type?: 'bug' | 'feature_request';
    status?: 'open' | 'in_progress' | 'resolved';
}

export interface IIssueQuery {
    sort?: 'newest' | 'oldest';
    type?: 'bug' | 'feature_request';
    status?: 'open' | 'in_progress' | 'resolved';
}