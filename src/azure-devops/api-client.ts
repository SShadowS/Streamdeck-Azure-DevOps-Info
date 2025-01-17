import { Logger } from "../utils/logger";

export class AzureDevOpsClient {
    private readonly logger = Logger.getInstance('AzureDevOpsClient');
    private readonly baseUrl: string;
    private readonly pat: string;
    private cache: Map<string, { data: any, timestamp: number }> = new Map();
    private cacheDuration: number = 30000; // 30 seconds
    private maxRetries: number = 3;
    private retryDelay: number = 1000;

    constructor(organization: string, project: string, pat: string) {
        this.baseUrl = `https://dev.azure.com/${organization}/${project}/_apis`;
        this.pat = pat;
    }

    private async makeRequest<T>(endpoint: string, retryCount = 0): Promise<T> {
        try {
            this.logger.log(`Making request to: ${endpoint}`, 'debug');
            // Check cache first
            const cached = this.cache.get(endpoint);
            if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
                return cached.data as T;
            }

            const auth = Buffer.from(`:${this.pat}`).toString('base64');
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 429 && retryCount < this.maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                    return this.makeRequest(endpoint, retryCount + 1);
                }
                throw new Error(`Azure DevOps API error: ${response.statusText}`);
            }

            const data = await response.json() as T;
            this.cache.set(endpoint, { data, timestamp: Date.now() });
            return data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.log(`Request failed: ${error.message}`, 'error');
            } else {
                this.logger.log(`Request failed: ${String(error)}`, 'error');
            }
            if (retryCount < this.maxRetries) {
                this.logger.log(`Retrying (${retryCount + 1}/${this.maxRetries})...`, 'warn');
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.makeRequest(endpoint, retryCount + 1);
            }
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    public clearCache(): void {
        this.cache.clear();
    }

    public setCacheDuration(duration: number): void {
        this.cacheDuration = duration;
    }

    public setRetryPolicy(maxRetries: number, retryDelay: number): void {
        this.maxRetries = maxRetries;
        this.retryDelay = retryDelay;
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

    public async testConnection(): Promise<boolean> {
        try {
            await this.makeRequest('/git/repositories?api-version=7.1-preview.1');
            return true;
        } catch (error) {
            if (error instanceof Error && error.message.includes('401')) {
                return false;
            }
            return false;
        }
    }
}
