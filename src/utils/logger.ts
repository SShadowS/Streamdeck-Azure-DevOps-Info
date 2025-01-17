import streamDeck, { LogLevel } from "@elgato/streamdeck";

export class Logger {
    private static instance: Logger;
    private scopedLogger: any;

    private constructor(scope?: string) {
        this.scopedLogger = scope ? 
            streamDeck.logger.createScope(scope) : 
            streamDeck.logger;
    }

    public static getInstance(scope?: string): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(scope);
        }
        return Logger.instance;
    }

    public log(message: string, level: 'trace' | 'debug' | 'info' | 'warn' | 'error' = 'info'): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}`;
        
        switch (level) {
            case 'trace':
                this.scopedLogger.trace(logMessage);
                break;
            case 'debug':
                this.scopedLogger.debug(logMessage);
                break;
            case 'info':
                this.scopedLogger.info(logMessage);
                break;
            case 'warn':
                this.scopedLogger.warn(logMessage);
                break;
            case 'error':
                this.scopedLogger.error(logMessage);
                break;
        }
    }

    public setLevel(level: LogLevel): void {
        this.scopedLogger.setLevel(level);
    }

    public createScope(scope: string): Logger {
        return new Logger(scope);
    }
}
