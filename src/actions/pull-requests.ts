import { action, SingletonAction } from "@elgato/streamdeck";
import { WillAppearEvent, KeyDownEvent } from "@elgato/streamdeck";
import { AzureDevOpsClient } from "../azure-devops/api-client";
import { PullRequest } from "../azure-devops/types";

type PullRequestSettings = {
    repositoryId?: string;
    refreshInterval?: number;
};

@action({ UUID: "com.torben-leth.azure-devops-info.pull-requests" })
export class PullRequestsAction extends SingletonAction<PullRequestSettings> {
    private client: AzureDevOpsClient;
    private interval?: NodeJS.Timeout;

    constructor() {
        super();
        this.client = new AzureDevOpsClient(
            process.env.AZURE_ORGANIZATION || '',
            process.env.AZURE_PROJECT || '',
            process.env.AZURE_PAT || ''
        );
    }

    override async onWillAppear(ev: WillAppearEvent<PullRequestSettings>): Promise<void> {
        await this.updatePullRequests(ev);
        
        const interval = ev.payload.settings.refreshInterval || 60000;
        this.interval = setInterval(() => this.updatePullRequests(ev), interval);
    }

    override async onWillDisappear(): Promise<void> {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    override async onKeyDown(ev: KeyDownEvent<PullRequestSettings>): Promise<void> {
        await this.updatePullRequests(ev);
    }

    private async updatePullRequests(ev: WillAppearEvent<PullRequestSettings> | KeyDownEvent<PullRequestSettings>): Promise<void> {
        const { repositoryId } = ev.payload.settings;
        if (!repositoryId) {
            await ev.action.setTitle("No Repo");
            return;
        }

        try {
            const prs = await this.client.getPullRequests(repositoryId);
            const myPrs = prs.filter((pr: PullRequest) => pr.createdBy.displayName === process.env.AZURE_USER);
            await ev.action.setTitle(`${myPrs.length}`);
            await ev.action.setImage(`imgs/actions/pull-requests/${myPrs.length > 0 ? 'active' : 'inactive'}.png`);
        } catch (error) {
            await ev.action.setTitle("Error");
            console.error('Failed to fetch pull requests:', error);
        }
    }
}
