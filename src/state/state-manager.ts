import { Logger } from "../utils/logger";

type State = {
    apiHealth: 'healthy' | 'degraded' | 'unhealthy';
    lastError?: string;
    lastSuccess?: Date;
    requestCount: number;
    errorCount: number;
};

export class StateManager {
    private static instance: StateManager;
    private state: State = {
        apiHealth: 'healthy',
        requestCount: 0,
        errorCount: 0
    };
    private logger = Logger.getInstance('StateManager');

    private constructor() {}

    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    public getState(): State {
        return this.state;
    }

    public recordRequest(): void {
        this.state.requestCount++;
        this.logger.log(`Request recorded. Total: ${this.state.requestCount}`, 'debug');
    }

    public recordSuccess(): void {
        this.state.lastSuccess = new Date();
        this.state.apiHealth = 'healthy';
        this.logger.log('API request succeeded', 'debug');
    }

    public recordError(error: Error): void {
        this.state.errorCount++;
        this.state.lastError = error.message;
        this.state.apiHealth = this.state.errorCount > 3 ? 'unhealthy' : 'degraded';
        this.logger.log(`Error recorded: ${error.message}`, 'error');
    }

    public reset(): void {
        this.state = {
            apiHealth: 'healthy',
            requestCount: 0,
            errorCount: 0
        };
        this.logger.log('State reset', 'info');
    }
}
