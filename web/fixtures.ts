import path from 'path';
import { existsSync, writeFileSync } from 'fs';
import { test as base, expect as baseExpect, Locator } from 'playwright/test';
import { Context, Page, AEMEnv, HybridEnv, TestEnv, testContext } from './context';
import { loginWDS, login } from './common';
import { navigatedTo } from './expect';
import { messages, Errors } from './errors';
import { Account, AccountQuery } from './account';
import { Product, ProductQuery } from './product';
import { Order, OrderQuery } from './order';
import API from './API';
import BC from './BC';
import Cart from './Cart';
import Checkout from './Checkout';
import Home from './Home';
import MyOrders from './MyOrders';
import MyPage from './MyPage';
import PD from './PD';
import PF from './PF';
import Splash from './Splash';
import SSO from './SSO';

export type { Context, Page };

export type TestArgs = TestEnv & {
    workingDir?: string;

    accounts: Account[];
    account?: AccountQuery;

    products: Product[];
    product?: ProductQuery;
    product2?: ProductQuery;
    product3?: ProductQuery;
    product4?: ProductQuery;

    orders: Order[];
    order?: OrderQuery;
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
    splash: Splash;
    checkout: Checkout;
    myPage: MyPage;
    myOrders: MyOrders;

    errors: Errors;
    capture(name: string, locator?: Locator): Promise<Buffer<ArrayBufferLike>>;
}

const noop = () => { };

export const test = base.extend<TestArgs & Fixtures>({
    site: [process.env.SITE!, { option: true }],
    siteUid: [process.env.SITE_UID!, { option: true }],
    env: [process.env.HYBRID_ENV as HybridEnv || 'stg2', { option: true }],
    envAEM: [process.env.AEM_ENV as AEMEnv || 'p6-pre-qa2', { option: true }],
    asRegistered: [false, { option: true }],
    workingDir: [undefined, { option: true }],

    account: [undefined, { option: true }],
    product: [undefined, { option: true }],
    product2: [undefined, { option: true }],
    product3: [undefined, { option: true }],
    product4: [undefined, { option: true }],
    order: [undefined, { option: true }],

    accounts: async ({ env, workingDir }, use) => {
        const dir = workingDir || path.dirname(base.info().file);
        const file = path.join(dir, env == 'prod' ? 'prod_accounts.json' : 'accounts.json');
        const data = existsSync(file) ? require(file) : [];
        await use(data);
        if (existsSync(file)) {
            writeFileSync(file, JSON.stringify(data, null, 2));
        }
    },

    products: async ({ env, siteUid, workingDir }, use) => {
        const dir = workingDir || path.dirname(base.info().file);
        const file = path.join(dir, `${env}${siteUid ? `_${siteUid}` : ''}_products.json`);
        const data = existsSync(file) ? require(file) : [];
        await use(data);
        if (existsSync(file)) {
            writeFileSync(file, JSON.stringify(data, null, 2));
        }
    },

    orders: async ({ env, siteUid, workingDir }, use) => {
        const dir = workingDir || path.dirname(base.info().file);
        const file = path.join(dir, `${env}${siteUid ? `_${siteUid}` : ''}_orders.json`);
        const data = existsSync(file) ? require(file) : [];
        await use(data);
        if (existsSync(file)) {
            writeFileSync(file, JSON.stringify(data, null, 2));
        }
    },

    profile: [async ({ site, env, workingDir }, use) => {
        const profile = require(`../data/${site.toUpperCase()}.json`);
        const file = path.join(workingDir || path.dirname(base.info().file), `${env}_data.json`);
        if (existsSync(file)) {
            Object.assign(profile, require(file));
        }
        await use(profile);
    }, { box: true }],

    storageState: async ({ asRegistered, accounts, account, workingDir }, use) => {
        const user = account?.findOne(accounts) || asRegistered ? accounts[0] : undefined;
        if (!user) return await use(undefined);
        const id = user.email.replaceAll(/[^\w]/g, '_').toLowerCase();
        const filename = path.join(workingDir || path.dirname(base.info().file), '.auth', id + '.json');
        await use(existsSync(filename) ? filename : undefined);
    },

    context: async ({ context, site, siteUid, env, envAEM, profile, asRegistered, accounts, products, orders, account, product, product2, product3, product4, order }, use) => {
        Object.assign(context, testContext({
            site,
            siteUid,
            env,
            envAEM,
            profile,
            asRegistered,
            account: account?.findOne(accounts) || asRegistered ? accounts[0] : undefined,
            product: await product?.findOne(products),
            product2: await product2?.findOne(products),
            product3: await product3?.findOne(products),
            product4: await product4?.findOne(products),
            order: await order?.findOne(orders),
            checkoutEmail: 'autotest@wisewires.com'
        }));
        await use(context);
    },

    page: async ({ context, page }, use) => {
        const goto = page.goto.bind(page);
        page.goto = async (url: string) => {
            const { env } = context;
            if (env != 'prod' && !context.cookieRequested) {
                await goto(context.cookieURL);
                await page.waitForTimeout(1000);
                context.cookieRequested = true;
            }
            if (env != 'prod' && !context.wdsReady && url.startsWith('https://p6-')) {
                await goto('https://wds.samsung.com');
                await loginWDS(page);
                context.wdsReady = true;
                if (!context.pointingRequested) {
                    await goto(context.pointingURL);
                    await page.getByText('"SUCCESS"').waitFor({ timeout: 30000 }).catch(() => {
                        throw new Error('Failed to request pointing URL')
                    });
                    await page.waitForTimeout(1000);
                    context.pointingRequested = true;
                }
            }
            let res;
            if (context.profile.cluster.startsWith('SMN') && !context.site.startsWith('KZ')) {
                const consentResponse = page.waitForResponse('https://consent.trustarc.com/notice*', { timeout: 30000 }).catch(() => { });
                res = await goto(url);
                await consentResponse;
            } else {
                res = await goto(url);
            }
            await page.locator('#truste-consent-button:visible, [an-la="cookie bar:accept"]:visible').click({ timeout: 3000 }).catch(noop);
            await page.waitForTimeout(2000);
            await page.waitForLoadState();
            await page.addLocatorHandler(
                page.locator('#truste-consent-track:visible, .cookie-bar:visible'),
                (l) => l.locator('#truste-consent-button, [an-la="cookie bar:accept"]').click().catch(noop)
            ).catch(noop);
            await page.addLocatorHandler(
                page.locator('app-country-selector-modal:visible'),
                (modal) => modal.locator('.modal__close').click().catch(noop)
            ).catch(noop);
            await page.addStyleTag({ content: '.ins-preview-wrapper { display: none; }' }).catch(noop);
            if (context.asRegistered && !context.ssoSignedIn) {
                await login(page);
            }
            return res;
        };
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

    splash: async ({ page }, use) => {
        await use(new Splash(page));
    },

    checkout: async ({ page }, use) => {
        await use(new Checkout(page));
    },

    myPage: async ({ page }, use) => {
        await use(new MyPage(page));
    },

    myOrders: async ({ page }, use) => {
        await use(new MyOrders(page));
    },

    errors: async ({ env, workingDir }, use) => {
        const errorsFile = path.join(workingDir || path.dirname(base.info().file), 'errors.json');
        const issuesFile = path.join(workingDir || path.dirname(base.info().file), `${env}_issues.json`);
        const errors = existsSync(errorsFile) ? require(errorsFile) : {};
        const issues = existsSync(issuesFile) ? require(issuesFile) : {};
        const proxy = new Proxy({ ...messages, errors, ...issues }, {
            get(target, prop) {
                return target[prop as keyof Errors] || prop;
            }
        });
        await use(proxy);
    },

    capture: async ({ page }, use) => {
        async function captureFn(name: string, locator?: Locator) {
            return page.screenshot({ fullPage: true, type: 'jpeg' });
        }
        await use(captureFn);
    },
});

export const expect = baseExpect.extend({
    containSKU: Cart.containSKU,
    navigatedTo,
});
