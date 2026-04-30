import type { BrowserContext, Page as BasePage } from 'playwright';

export type AEMEnv = 'p6-pre-qa' | 'p6-pre-qa2';

export type HybridEnv = 'prod' | 'stg2';

export type TestEnv = {
    site: string;
    siteUid: string;
    env: HybridEnv;
    envAEM: AEMEnv;
    profile: Profile;
}

export type TestData = {
    account?: Account;
    product?: Product;
    product2?: Product;
    product3?: Product;
    product4?: Product;
    order?: Order;
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
            return `https://${this.envAEM}.samsung.com/aemapi/v6/storedomain/setdata?siteCode=${siteCode}&storeDomain=${storeDomain}&storeWebDomain=${storeWebDomain}&storeNewHybDomain=${storeNewHybDomain}&cart=${this.cartURL}`;
        },
        get exchangeEndpoint() {
            return this.profile.exchangeEndpoints?.[this.env]!;
        },
        get tariffEndpoint() {
            return this.profile.tariffEndpoints?.[this.env]!;
        },
        get homeURL() {
            const site = this.site.toLowerCase();
            const siteMap: Record<string, string> = {
                'jo': 'levant',
                'jo_ar': 'levant_ar',
                'ma': 'n_africa',
                'kw': 'ae',
                'bh': 'ae',
                'om': 'ae',
                'qa': 'ae',
                'kw_ar': 'ae_ar',
                'bh_ar': 'ae_ar',
                'om_ar': 'ae_ar',
                'qa_ar': 'ae_ar',
            }
            let path = this.siteUid ? this.profile.stores[this.siteUid] : '';
            if (path && !path.includes('/business')) {
                path = `/multistore/${this.siteUid}`;
            }
            if (!this.env || this.env == 'prod') {
                return `https://samsung.com/${site}${path}`;
            }
            if (site in siteMap) {
                return `https://${this.envAEM}.samsung.com/${siteMap[site]}${path}`;
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
