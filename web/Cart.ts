import assert from 'assert';
import type { Locator } from 'playwright';
import type { ExpectMatcherState, MatcherReturnType } from 'playwright/test';
import type { Page } from 'fixtures';

import API from './API';
import GNB from './GNB';
import Recommendation from './Recommendation';
import { CartRHS } from './RHS';

/**
 * Empty cart page
 */
class EmptyCart {
    readonly section: Locator;
    readonly icon: Locator;
    readonly headline: Locator;
    readonly subtitle: Locator;
    readonly continueShoppingBtn: Locator;
    readonly signInBtn: Locator;

    constructor(private page: Page) {
        this.section = this.page.locator('.cart-details__empty');
        this.icon = this.section.locator('[svgicon="cart"]');
        this.headline = this.section.getByRole('heading');
        this.subtitle = this.section.locator('h2 + p');
        this.continueShoppingBtn = this.section.locator('[data-an-la="empty cart:continue shopping"], [data-an-la="empty cart:back to previous"]') // ID: [data-an-la="empty cart:back to previous"]
        this.signInBtn = this.section.locator('[data-an-la="empty cart:sign in"]');
    }
}

/**
 * Cart page (Hybrid)
 */
export default class Cart {
    private api: API;

    readonly gnb: GNB;
    readonly empty: EmptyCart;
    readonly recommendation: Recommendation;
    readonly rhs: CartRHS;

    readonly main: Locator;
    readonly cartItemList: Locator;
    readonly cartItems: Locator;

    constructor(readonly page: Page) {
        this.api = new API(page);
        this.gnb = new GNB(page.locator('app-header-global').last());
        this.empty = new EmptyCart(page);
        this.recommendation = new Recommendation(page.locator('main app-product-recommendation-v2'));
        this.rhs = new CartRHS(page.locator('cx-page-slot[position="TokoRightContent"]'));

        this.main = page.locator('main');
        this.cartItemList = page.locator('cx-cart-item-list-v2');
        this.cartItems = page.locator('cx-cart-item-v2');
    }

    get url() {
        return this.page.context().cartURL();
    }

    async addToCart(product: Product) {
        try {
            await this.api.addToCart(product.sku);
            await this.page.reload();
            await this.waitForLoad();
            product.canBuy = true;
        } catch (error: any) {
            product.canBuy = false;
            throw new Error(`Unable to add product ${product.sku} to cart: ${error.message}`);
        }
    }

    async waitForLoad() {
        try {
            await this.cartItemList.or(this.empty.section).waitFor({ timeout: 30000 });
            await this.rhs.section.waitFor({ timeout: 5000 });
        } catch (error) {
            console.error(error);
            throw new Error('Cart page is not loaded successfully');
        }
    }

    async continueToCheckout() {
        await this.rhs.totalAmount.waitFor();
        for (let tries = 1; tries <= 2; tries++) {
            try {
                const btn = await this.rhs.checkoutBtn.or(this.rhs.guestCheckoutBtn).last().elementHandle({ timeout: 5000 });
                assert(btn, 'Checkout button is not visible');
                assert(await btn.isEnabled(), 'Checkout button is not enabled');
                await btn.click().catch(() => { throw new Error('Checkout button is not clickable') });
                await btn.waitForElementState('hidden', { timeout: 30000 }).catch(() => { throw new Error('Checkout button is not working') });
                break;
            } catch (error) {
                if (tries == 2) throw error;
                await this.page.waitForTimeout(5000);
            }
        }
    }

    static async toContainSKU(this: ExpectMatcherState, cart: Cart, sku: string, options?: { timeout?: number }): Promise<MatcherReturnType> {
        try {
            return { pass: true, message: () => `SKU ${sku} is in cart` };
        } catch (e) {
            return { pass: false, message: () => `SKU ${sku} is not in cart` };
        }
    }
}
