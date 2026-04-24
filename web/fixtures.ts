import path from 'path';
import { existsSync, writeFileSync } from 'fs';
import { test as base, expect as baseExpect, Locator } from 'playwright/test';
import { AccountQuery } from './account';
import { Context, Page, AEMEnv, HybridEnv, TestEnv, testContext } from './context';
import { navigatedTo } from './expect';
import { ProductQuery } from './product';
import { loginWDS } from './wds';

import API from './API';
import BC from './BC';
import Cart from './Cart';
import Checkout from './Checkout';
import Home from './Home';
import PD from './PD';
import PF from './PF';
import SSO from './SSO';

export type { Context, Page };

export type TestArgs = TestEnv & {
    accounts: Account[];
    account?: AccountQuery;

    products: Product[];
    product?: ProductQuery;
    product2?: ProductQuery;
    product3?: ProductQuery;
    product4?: ProductQuery;
}

export type Fixtures = {
    context: Context;
    page: Page;
    api: API;
    sso: SSO;
    home: Home;
    bc: BC;
    pd: PD;
    pf: PF;
    cart: Cart;
    checkout: Checkout;

    capture(name: string, locator: Locator): Promise<Buffer<ArrayBufferLike>>;
}

const noop = () => { };

export const test = base.extend<TestArgs & Fixtures>({
    site: [process.env.SITE!, { option: true }],
    siteUid: [process.env.SITE_UID!, { option: true }],
    env: [process.env.HYBRID_ENV as HybridEnv || 'stg2', { option: true }],
    envAEM: [process.env.AEM_ENV as AEMEnv || 'p6-pre-qa2', { option: true }],
    account: [undefined, { option: true }],
    product: [undefined, { option: true }],
    product2: [undefined, { option: true }],
    product3: [undefined, { option: true }],
    product4: [undefined, { option: true }],

    accounts: async ({ env }, use) => {
        const dir = path.dirname(base.info().file);
        const file = path.join(dir, env == 'prod' ? 'prod_accounts.json' : 'accounts.json');
        const data = existsSync(file) ? require(file) : [];
        await use(data);
        writeFileSync(file, JSON.stringify(data, null, 2));
    },

    products: async ({ env, siteUid }, use) => {
        const dir = path.dirname(base.info().file);
        const file = path.join(dir, `${env}${siteUid ? `_${siteUid}` : ''}_products.json`);
        const data = existsSync(file) ? require(file) : [];
        await use(data);
        writeFileSync(file, JSON.stringify(data, null, 2));
    },

    profile: [async ({ site }, use) => {
        const profile = require(`../data/${site.toUpperCase()}.json`);
        await use(profile);
    }, { box: true }],

    context: async ({ context, site, siteUid, env, envAEM, profile, accounts, products, account, product, product2, product3, product4 }, use) => {
        Object.assign(context, testContext({
            site,
            siteUid,
            env,
            envAEM,
            profile,
            account: account?.findOne(accounts),
            product: product?.findOne(products),
            product2: product2?.findOne(products),
            product3: product3?.findOne(products),
            product4: product4?.findOne(products),
        }));
        await use(context);
    },

    page: async ({ context, page }, use) => {
        const goto = page.goto.bind(page);
        page.goto = async (url: string) => {
            const { env } = context;
            if (env != 'prod' && !context.cookieRequested) {
                await goto(page.context().cookieURL());
                await page.waitForTimeout(1000);
                context.cookieRequested = true;
            }
            if (env != 'prod' && !context.wdsReady && url.startsWith('https://p6-')) {
                await goto('https://wds.samsung.com');
                await loginWDS(page);
                context.wdsReady = true;
                if (!context.pointingRequested) {
                    await goto(context.pointingUrl());
                    await page.getByText('"SUCCESS"').waitFor();
                    await page.waitForTimeout(1000);
                    context.pointingRequested = true;
                }
            }
            return goto(url);
        };
        await page.addLocatorHandler(
            page.locator('#truste-consent-track:visible'),
            async (l) => {
                try {
                    l.locator('#truste-consent-button').click();
                    await page.waitForTimeout(3000);
                    await page.waitForLoadState();
                } catch (e: any) {
                    console.warn(e?.message);
                }
            }
        ).catch(noop);
        await use(page);
    },

    api: async ({ page }, use) => {
        await use(new API(page));
    },

    sso: async ({ page }, use) => {
        await use(new SSO(page));
    },

    home: async ({ page }, use) => {
        await use(new Home(page));
    },

    bc: async ({ page }, use) => {
        await use(new BC(page));
    },

    pd: async ({ page }, use) => {
        await use(new PD(page));
    },

    pf: async ({ page }, use) => {
        await use(new PF(page));
    },

    cart: async ({ page }, use) => {
        await use(new Cart(page));
    },

    checkout: async ({ page }, use) => {
        await use(new Checkout(page));
    },

    capture: async ({ page }, use) => {
        async function captureFn(name: string, locator: Locator) {
            return page.screenshot({ fullPage: true, type: 'jpeg' });
        }
        await use(captureFn);
    },
});

export const expect = baseExpect.extend({
    toContainSKU: Cart.toContainSKU,
    navigatedTo,
});
