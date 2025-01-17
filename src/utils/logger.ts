import streamDeck from "@elgato/streamdeck";

export class Logger {
    private static instance: Logger;
    private constructor() {}

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(message: string, level: 'trace' | 'debug' | 'info' | 'warn' | 'error' = 'info'): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        switch (level) {
            case 'trace':
                streamDeck.logger.trace(logMessage);
                break;
            case 'debug':
                streamDeck.logger.debug(logMessage);
                break;
            case 'info':
                streamDeck.logger.info(logMessage);
                break;
            case 'warn':
                streamDeck.logger.warn(logMessage);
                break;
            case 'error':
                streamDeck.logger.error(logMessage);
                break;
        }
    }
}
