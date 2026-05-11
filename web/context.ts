import type { BrowserContext, Page as BasePage } from 'playwright';
import type { Account } from './account';
import type { Product } from './product';
import type { Order } from './order';

export type AEMEnv = 'p6-pre-qa' | 'p6-pre-qa2';

export type HybridEnv = 'prod' | 'stg2';

export type TestEnv = {
    site: string;
    siteUid: string;
    env: HybridEnv;
    envAEM: AEMEnv;
    profile: Profile;
    asRegistered?: boolean;
}

export type TestData = {
    account?: Account;
    product?: Product;
    product2?: Product;
    product3?: Product;
    product4?: Product;
    order?: Order;

    checkoutEmail: string;
}

export type TestState = {
    cookieRequested?: boolean;
    wdsReady?: boolean;
    pointingRequested?: boolean;
    ssoSignedIn?: boolean;
}

export type TestContext = TestEnv & TestData & TestState & {
    cluster: string;
    storeID: string;
    apiDomain: string;
    apiEndpoint: string;
    cookieURL: string;
    pointingURL: string;
    exchangeEndpoint: string;
    tariffEndpoint: string;
    homeURL: string;
    shopURL: string;
    cartURL: string;
    checkoutURL: string;
    splashURL: string;
    myPageURL: string;
    myOrdersURL: string;
    myVoucherURL: string;
    myWishlistURL: string;
    myProfileURL: string;
}

export type Context = BrowserContext & TestContext;

export type Page = Omit<BasePage, 'context'> & {
    context(): Context;
}

export function testContext(data: TestEnv & TestData): TestContext {
    return {
        ...data,
        get cluster() {
            return this.profile.cluster;
        },
        get storeID() {
            return this.siteUid || this.site.toLowerCase();
        },
        get apiDomain() {
            return this.profile.apiDomains[this.env];
        },
        get apiEndpoint() {
            return `${this.apiDomain}/tokocommercewebservices/v2/${this.storeID}`;
        },
        get cookieURL() {
            return `https://${this.env}.shop.samsung.com/getcookie.html`;
        },
        get pointingURL() {
            const siteCode = this.site.toLocaleLowerCase();
            const storeDomain = this.profile.storeDomains?.[this.env] || this.apiDomain;
            const storeWebDomain = `https://${this.env}.shop.samsung.com${this.siteUid ? `/${siteCode}/multistore` : ''}`;
            const storeNewHybDomain = this.profile.storeNewHybDomains?.[this.env] || storeDomain;
            const additionalPointing = this.profile.additionalPointing || '';
            return `https://${this.envAEM}.samsung.com/aemapi/v6/storedomain/setdata?siteCode=${siteCode}&storeDomain=${storeDomain}&storeWebDomain=${storeWebDomain}&storeNewHybDomain=${storeNewHybDomain}&cart=${this.cartURL}${additionalPointing}`;
        },
        get exchangeEndpoint() {
            return this.profile.exchangeEndpoints?.[this.env]!;
        },
        get tariffEndpoint() {
            return this.profile.tariffEndpoints?.[this.env]!;
        },
        get homeURL() {
            const siteMap: Record<string, string> = {
                'JO': 'levant',
                'JO_AR': 'levant_ar',
                'MA': 'n_africa',
                'KW': 'ae',
                'BH': 'ae',
                'OM': 'ae',
                'QA': 'ae',
                'KW_AR': 'ae_ar',
                'BH_AR': 'ae_ar',
                'OM_AR': 'ae_ar',
                'QA_AR': 'ae_ar',
            }
            const site = siteMap[this.site] || this.site.toLowerCase();
            let path = this.siteUid ? this.profile.stores[this.siteUid] : '';
            if (path && !path.includes('/business')) {
                path = `/multistore/${this.siteUid}`;
            }
            if (!this.env || this.env == 'prod') {
                return `https://samsung.com/${site}${path}`;
            }
            return `https://${this.envAEM}.samsung.com/${site}${path}`;
        },
        get shopURL() {
            const site = this.site.toLowerCase();
            const sub = (this.env && this.env != 'prod') ? this.env + '.' : '';
            const path = this.siteUid ? this.profile.stores[this.siteUid] : '';
            return `https://${sub}shop.samsung.com/${site}${path}`;
        },
        get cartURL() {
            return this.shopURL + '/cart';
        },
        get checkoutURL() {
            return this.shopURL + '/checkout/one';
        },
        get splashURL() {
            return this.shopURL + '/guestlogin/checkout';
        },
        get myPageURL() {
            return this.homeURL + '/mypage';
        },
        get myOrdersURL() {
            return this.shopURL + '/mypage/orders';
        },
        get myVoucherURL() {
            return this.shopURL + '/mypage/vouchers';
        },
        get myWishlistURL() {
            return this.shopURL + '/mypage/wishlist';
        },
        get myProfileURL() {
            return this.shopURL + '/mypage/profile-setting';
        },
    }
}
