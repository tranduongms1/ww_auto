declare global {
    export type TradeInData = {
        postalCode?: string;
        category?: string;
        brand?: string;
        model?: string;
        subseries?: string;
        device?: string;
        storage?: string;
        color?: string;
        imei?: string;
        deviceConditions?: 'first' | 'last' | 'first-then-last';
    }

    export type TradeUpData = {
        postalCode?: string;
        category?: string;
        model?: string;
        brand?: string;
    }

    export type Profile = {
        cluster: string;
        stores: Record<string, string>;
        apiDomains: Record<string, string>;
        storeDomains?: Record<string, string>;
        storeNewHybDomains?: Record<string, string>;
        exchangeEndpoints?: Record<string, string>;
        tariffEndpoints?: Record<string, string>;
        additionalPointing?: string;
        tradeIn?: TradeInData;
        tradeUp?: TradeUpData;
    }

    type PriceData = {
        formattedValue: string;
        value: number;
    }

    export type CartEntry = {
        entryNumber: number;
        isServiceEntry: boolean;
        product: {
            code: string;
            name: string;
        };
        quantity: number;
        totalPrice: PriceData;
        [key: string]: any;
    }

    export type CartInfo = {
        code: string;
        guid: string;
        entries: CartEntry[];
        totalItems: number;
        totalPrice: PriceData;
        [key: string]: any;
    }

    export interface MailService {
        email: string;
        openInbox(): Promise<void>;
        getOTP(this: MailService): Promise<string>;
    }
}

export default global;