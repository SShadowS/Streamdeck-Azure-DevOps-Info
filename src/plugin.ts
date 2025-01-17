import streamDeck, { LogLevel } from "@elgato/streamdeck";
import { IncrementCounter } from "./actions/increment-counter";
import { PipelineStatusAction } from "./actions/pipeline-status";
import { PullRequestsAction } from "./actions/pull-requests";
import { WorkItemsAction } from "./actions/work-items";
import { SettingsAction } from "./actions/settings";
import { AzureDevOpsClient } from "./azure-devops/api-client";

// Initialize Azure DevOps client
const azureClient = new AzureDevOpsClient(
    process.env.AZURE_ORGANIZATION || '',
    process.env.AZURE_PROJECT || '',
    process.env.AZURE_PAT || ''
);

streamDeck.logger.setLevel(LogLevel.TRACE);
streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.actions.registerAction(new PipelineStatusAction());
streamDeck.actions.registerAction(new PullRequestsAction());
streamDeck.actions.registerAction(new WorkItemsAction());
streamDeck.actions.registerAction(new SettingsAction());
streamDeck.connect();
