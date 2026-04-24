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
}

export type TestState = {
    cookieRequested?: boolean;
    wdsReady?: boolean;
    pointingRequested?: boolean;
    ssoSignedIn?: boolean;
}

export type TestContext = TestEnv & TestData & TestState & {
    cluster(): string;
    storeID(): string;
    apiDomain(): string;
    apiEndpoint(): string;
    cookieURL(): string;
    pointingUrl(): string;
    exchangeEndpoint(): string;
    tariffEndpoint(): string;
    homeURL(): string;
    shopURL(): string;
    cartURL(): string;
    checkoutURL(): string;
    splashURL(): string;
    myPageURL(): string;
    myOrdersURL(): string;
    myVoucherURL(): string;
    myWishlistURL(): string;
    myProfileURL(): string;
}

export type Context = BrowserContext & TestContext;

export type Page = Omit<BasePage, 'context'> & {
    context(): Context;
}

export function testContext(data: TestEnv & TestData): TestContext {
    return {
        ...data,
        cluster() {
            return this.profile.cluster;
        },
        storeID() {
            return this.siteUid || this.site.toLowerCase();
        },
        apiDomain() {
            return this.profile.apiDomains[this.env];
        },
        apiEndpoint() {
            return `${this.apiDomain()}/tokocommercewebservices/v2/${this.storeID()}`;
        },
        cookieURL() {
            return `https://${this.env}.shop.samsung.com/getcookie.html`;
        },
        pointingUrl() {
            const siteCode = this.site.toLocaleLowerCase();
            const storeDomain = this.profile.storeDomains?.[this.env] || this.apiDomain();
            const storeWebDomain = `https://${this.env}.shop.samsung.com/${siteCode}${this.siteUid ? '/multistore' : ''}`;
            const storeNewHybDomain = this.profile.storeNewHybDomains?.[this.env] || storeDomain;
            return `https://${this.envAEM}.samsung.com/aemapi/v6/storedomain/setdata?siteCode=${siteCode}&storeDomain=${storeDomain}&storeWebDomain=${storeWebDomain}&storeNewHybDomain=${storeNewHybDomain}`;
        },
        exchangeEndpoint() {
            return this.profile.exchangeEndpoints?.[this.env]!;
        },
        tariffEndpoint() {
            return this.profile.tariffEndpoints?.[this.env]!;
        },
        homeURL() {
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
            const path = this.siteUid ? this.profile.stores[this.siteUid] : '';
            if (!this.env || this.env == 'prod') {
                return `https://samsung.com/${site}${path}`;
            }
            if (site in siteMap) {
                return `https://${this.envAEM}.samsung.com/${siteMap[site]}${path}`;
            }
            return `https://${this.envAEM}.samsung.com/${site}${path}`;
        },
        shopURL() {
            const site = this.site.toLowerCase();
            const sub = (this.env && this.env != 'prod') ? this.env + '.' : '';
            const path = this.siteUid ? this.profile.stores[this.siteUid] : '';
            return `https://${sub}shop.samsung.com/${site}${path}`;
        },
        cartURL() {
            return this.shopURL() + '/cart';
        },
        checkoutURL() {
            return this.shopURL() + '/checkout/one';
        },
        splashURL() {
            return this.shopURL() + '/guestlogin/checkout';
        },
        myPageURL() {
            return this.homeURL() + '/mypage';
        },
        myOrdersURL() {
            return this.shopURL() + '/mypage/orders';
        },
        myVoucherURL() {
            return this.shopURL() + '/mypage/vouchers';
        },
        myWishlistURL() {
            return this.shopURL() + '/mypage/wishlist';
        },
        myProfileURL() {
            return this.shopURL() + '/mypage/profile-setting';
        },
    }
}
