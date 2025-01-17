import { action, SingletonAction } from "@elgato/streamdeck";
import { WillAppearEvent, KeyDownEvent } from "@elgato/streamdeck";
import { AzureDevOpsClient } from "../azure-devops/api-client";
import { WorkItem } from "../azure-devops/types";

type WorkItemSettings = {
    queryId?: string;
    refreshInterval?: number;
};

@action({ UUID: "com.torben-leth.azure-devops-info.work-items" })
export class WorkItemsAction extends SingletonAction<WorkItemSettings> {
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

    override async onWillAppear(ev: WillAppearEvent<WorkItemSettings>): Promise<void> {
        await this.updateWorkItems(ev);
        
        const interval = ev.payload.settings.refreshInterval || 60000;
        this.interval = setInterval(() => this.updateWorkItems(ev), interval);
    }

    override async onWillDisappear(): Promise<void> {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    override async onKeyDown(ev: KeyDownEvent<WorkItemSettings>): Promise<void> {
        await this.updateWorkItems(ev);
    }

    private async updateWorkItems(ev: WillAppearEvent<WorkItemSettings> | KeyDownEvent<WorkItemSettings>): Promise<void> {
        const { queryId } = ev.payload.settings;
        if (!queryId) {
            await ev.action.setTitle("No Query");
            return;
        }

        try {
            const workItems = await this.client.getWorkItems(queryId);
            await ev.action.setTitle(`${workItems.length}`);
            await ev.action.setImage(`imgs/actions/work-items/${workItems.length > 0 ? 'active' : 'inactive'}.png`);
        } catch (error: unknown) {
            await ev.action.setTitle("Error");
            if (error instanceof Error) {
                console.error('Failed to fetch work items:', error);
            } else {
                console.error('Failed to fetch work items:', String(error));
            }
        }
    }
}
