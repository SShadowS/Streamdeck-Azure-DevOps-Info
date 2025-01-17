declare global {
    interface Window {
        streamDeck: {
            testConnection: (settings: {
                organization: string;
                project: string;
                pat: string;
            }) => Promise<{ success: boolean }>;
            setSettings: (settings: any) => void;
            onDidReceiveSettings: (callback: (event: { settings: any }) => void) => void;
        };
    }
}

export {};
