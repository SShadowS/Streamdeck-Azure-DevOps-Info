export class AzureDevOpsClient {
    private readonly baseUrl: string;
    private readonly pat: string;

    constructor(organization: string, project: string, pat: string) {
        this.baseUrl = `https://dev.azure.com/${organization}/${project}/_apis`;
        this.pat = pat;
    }

    private async makeRequest<T>(endpoint: string): Promise<T> {
        const auth = Buffer.from(`:${this.pat}`).toString('base64');
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Azure DevOps API error: ${response.statusText}`);
        }

        return response.json();
    }

    public async getPipelineStatus(pipelineId: number): Promise<any> {
        return this.makeRequest(`/pipelines/runs?pipelineId=${pipelineId}&api-version=7.1-preview.1`);
    }

    public async getPullRequests(repositoryId: string): Promise<any> {
        return this.makeRequest(`/git/pullrequests?repositoryId=${repositoryId}&api-version=7.1-preview.1`);
    }

    public async getWorkItems(queryId: string): Promise<any> {
        return this.makeRequest(`/wit/wiql/${queryId}?api-version=7.1-preview.2`);
    }
}
