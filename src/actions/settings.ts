import { action, SingletonAction } from "@elgato/streamdeck";
declare const window: Window;
import { StateManager } from "../state/state-manager";
import { WillAppearEvent, KeyDownEvent } from "@elgato/streamdeck";
import { AzureDevOpsClient } from "../azure-devops/api-client";

type Settings = {
    organization?: string;
    project?: string;
    pat?: string;
    cacheDuration?: number;
    maxRetries?: number;
    retryDelay?: number;
};

@action({ UUID: "com.torben-leth.azure-devops-info.settings" })
export class SettingsAction extends SingletonAction<Settings> {
    private client: AzureDevOpsClient;
    private stateManager = StateManager.getInstance();

    constructor() {
        super();
        this.client = new AzureDevOpsClient(
            process.env.AZURE_ORGANIZATION || '',
            process.env.AZURE_PROJECT || '',
            process.env.AZURE_PAT || ''
        );
        window.streamDeck.testConnection = this.testConnection.bind(this);
    }

    private async testConnection(settings: Settings): Promise<{ success: boolean }> {
        if (!settings.organization || !settings.project || !settings.pat) {
            return { success: false };
        }

        const testClient = new AzureDevOpsClient(
            settings.organization,
            settings.project,
            settings.pat
        );

        try {
            await testClient.testConnection();
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    }

    override async onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> {
        await this.updateSettings(ev);
    }

    override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
        await this.updateSettings(ev);
    }

    private async updateSettings(ev: WillAppearEvent<Settings> | KeyDownEvent<Settings>): Promise<void> {
        const { organization, project, pat, cacheDuration, maxRetries, retryDelay } = ev.payload.settings;
        
        if (organization && project && pat) {
            process.env.AZURE_ORGANIZATION = organization;
            process.env.AZURE_PROJECT = project;
            process.env.AZURE_PAT = pat;
            
            if (cacheDuration) {
                this.client.setCacheDuration(cacheDuration);
            }
            
            if (maxRetries && retryDelay) {
                this.client.setRetryPolicy(maxRetries, retryDelay);
            }
            
            this.client.clearCache();
            this.stateManager.reset();
            await ev.action.setTitle("Settings Updated");
        } else {
            await ev.action.setTitle("Invalid Settings");
        }
    }
}
