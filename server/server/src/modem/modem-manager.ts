import { ModemManagerClient } from "./modem-client";
// import { USSDCode } from "./types";

interface USSDTask {
    id: string;
    type: 'ussd' | 'cashin' | 'cashout' | 'sms';
    data: any;
    resolve: (result: any) => void;
    reject: (error: any) => void;
}

class ModemManager {
    private static instance: ModemManager;
    private mm: ModemManagerClient;
    private queue: USSDTask[] = [];
    private processing = false;
    private initialized = false;

    private constructor() {
        this.mm = new ModemManagerClient();
    }

    static getInstance(): ModemManager {
        if (!ModemManager.instance) {
            ModemManager.instance = new ModemManager();
        }
        return ModemManager.instance;
    }

    async init() {
        if (!this.initialized) {
            await this.mm.init();
            this.initialized = true;
        }
    }

    async sendSMS(number: string, text: string) {
        return this.mm.sendSMS(number, text);
    }

    async queueSMS(number: string, text: string): Promise<string> {
        const task: USSDTask = {
            id: Date.now().toString(),
            type: 'sms',
            data: { number, text },
            resolve: () => {},
            reject: () => {}
        };
        this.queue.push(task);
        this.processQueue();
        return task.id;
    }

    async listSMS() {
        return this.mm.listSMS();
    }

    async deleteSMS(smsPath: string) {
        return this.mm.deleteSMS(smsPath);
    }

    async queueUSSD(code: string): Promise<string> { // Todo: Use USSD Code for requests and create a ussd session for manual code sending.
        const task: USSDTask = {
            id: Date.now().toString(),
            type: 'ussd',
            data: { code },
            resolve: () => {},
            reject: () => {}
        };
        this.queue.push(task);
        this.processQueue();
        return task.id;
    }

    async queueCashIn(number: string, amount: number): Promise<string> {
        const task: USSDTask = {
            id: Date.now().toString(),
            type: 'cashin',
            data: { number, amount },
            resolve: () => {},
            reject: () => {}
        };
        this.queue.push(task);
        this.processQueue();
        return task.id;
    }

    async queueCashOut(number: string, amount: number): Promise<string> {
        const task: USSDTask = {
            id: Date.now().toString(),
            type: 'cashout',
            data: { number, amount },
            resolve: () => {},
            reject: () => {}
        };
        this.queue.push(task);
        this.processQueue();
        return task.id;
    }

    async cancelUSSD() {
        return this.mm.cancelUSSD();
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        while (this.queue.length > 0) {
            const task = this.queue.shift()!;
            
            try {
                await this.mm.ensureIdle();
                
                let result: string;
                if (task.type === 'ussd') {
                    result = await this.mm.sendUSSD(task.data.code);
                } else if (task.type === 'cashin') {
                    const { cashInTo } = await import('./ussd');
                    result = await this.mm.navigateUSSDMenu(cashInTo(task.data.number, task.data.amount));
                } else if (task.type === 'cashout') {
                    const { cashOut } = await import('./ussd');
                    result = await this.mm.navigateUSSDMenu(cashOut(task.data.number, task.data.amount));
                } else if (task.type === 'sms') {
                    await this.mm.sendSMS(task.data.number, task.data.text);
                    result = 'SMS sent successfully';
                } else {
                    throw new Error('Unknown task type');
                }
                
                task.resolve(result);
            } catch (error) {
                task.reject(error);
            }
        }
        
        this.processing = false;
    }
}

export const modemManager = ModemManager.getInstance();
