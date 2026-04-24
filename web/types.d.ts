declare global {
    export type Profile = {
        cluster: string;
        stores: Record<string, string>;
        apiDomains: Record<string, string>;
        storeDomains?: Record<string, string>;
        storeNewHybDomains?: Record<string, string>;
        exchangeEndpoints?: Record<string, string>;
        tariffEndpoints?: Record<string, string>;
    }

    type Account = {
        email: string;
        password: string;
        addressCount?: number;
        orderCount?: number;
        wishlistCount?: number;
        emailAccount?: {
            url: string;
            account?: string;
            password?: string;
            session?: string;
            expiresAt?: Date;
        }
        eppRegistered?: string[];
        lastLoginAt?: Date;
    }

    type Product = {
        sku: string;
        type?: 'IM' | 'CE' | 'HA';
        bcURL?: string;
        pdURL?: string;
        pfURL?: string;
        addOn?: boolean;
        preOrder?: boolean;
        backOrder?: boolean;
        outOfStock?: boolean;
        tradeIn?: boolean;
        tradeUp?: boolean;
        scp?: boolean;
        stdSCP?: boolean;
        subSCP?: boolean;
        sim?: boolean;
        flex?: boolean;
        flexUpgrade?: boolean;
        galaxyClub?: boolean;
        warranty?: boolean;
        canBuy?: boolean;
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