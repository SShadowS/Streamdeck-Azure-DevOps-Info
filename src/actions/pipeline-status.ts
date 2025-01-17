import { action, SingletonAction } from "@elgato/streamdeck";
import { StateManager } from "../state/state-manager";
import { WillAppearEvent, KeyDownEvent } from "@elgato/streamdeck/events/actions";
import { AzureDevOpsClient } from "../azure-devops/api-client";
import { PipelineStatus } from "../azure-devops/types";

type PipelineSettings = {
    pipelineId?: number;
    refreshInterval?: number;
};

@action({ UUID: "com.torben-leth.azure-devops-info.pipeline" })
export class PipelineStatusAction extends SingletonAction<PipelineSettings> {
    private client: AzureDevOpsClient;
    private stateManager = StateManager.getInstance();
    private interval?: NodeJS.Timeout;

    constructor() {
        super();
        this.client = new AzureDevOpsClient(
            process.env.AZURE_ORGANIZATION || '',
            process.env.AZURE_PROJECT || '',
            process.env.AZURE_PAT || ''
        );
    }

    override async onWillAppear(ev: WillAppearEvent<PipelineSettings>): Promise<void> {
        // Set initial state
        await this.updatePipelineStatus(ev);

        // Setup refresh interval
        const interval = ev.payload.settings.refreshInterval || 30000;
        this.interval = setInterval(() => this.updatePipelineStatus(ev), interval);
    }

    override async onWillDisappear(): Promise<void> {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    override async onKeyDown(ev: KeyDownEvent<PipelineSettings>): Promise<void> {
        // Manual refresh on button press
        await this.updatePipelineStatus(ev);
    }

    private async updatePipelineStatus(ev: WillAppearEvent<PipelineSettings> | KeyDownEvent<PipelineSettings>): Promise<void> {
        const { pipelineId } = ev.payload.settings;
        if (!pipelineId) {
            await ev.action.setTitle("No Pipeline");
            return;
        }

        try {
            this.stateManager.recordRequest();
            const status = await this.client.getPipelineStatus(pipelineId);
            this.stateManager.recordSuccess();
            await ev.action.setTitle(status.state);
            await ev.action.setImage(`imgs/actions/pipeline/${status.state.toLowerCase()}.png`);
        } catch (error) {
            this.stateManager.recordError(error);
            await ev.action.setTitle("Error");
        }
    }
}
