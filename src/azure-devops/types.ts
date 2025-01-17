export interface PipelineStatus {
    id: number;
    name: string;
    state: string;
    result?: string;
}

export interface PullRequest {
    pullRequestId: number;
    title: string;
    createdBy: {
        displayName: string;
    };
    creationDate: string;
    status: string;
}

export interface WorkItem {
    id: number;
    url: string;
    fields: {
        'System.Title': string;
        'System.State': string;
    };
}
