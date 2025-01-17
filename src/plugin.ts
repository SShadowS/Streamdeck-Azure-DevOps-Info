import streamDeck, { LogLevel } from "@elgato/streamdeck";
import { IncrementCounter } from "./actions/increment-counter";
import { AzureDevOpsClient } from "./azure-devops/api-client";

// Initialize Azure DevOps client
const azureClient = new AzureDevOpsClient(
    process.env.AZURE_ORGANIZATION || '',
    process.env.AZURE_PROJECT || '',
    process.env.AZURE_PAT || ''
);

streamDeck.logger.setLevel(LogLevel.TRACE);
streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.connect();
