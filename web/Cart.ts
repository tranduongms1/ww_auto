import assert from 'assert';
import type { Locator, ExpectMatcherState, MatcherReturnType } from 'playwright/test';
import { expect, Page } from 'fixtures';
import type { Product } from './product';

import API from './API';
import GNB from './GNB';
import Recommendation from './Recommendation';
import { CartRHS } from './RHS';
import TradeIn from './TradeIn';
import TradeUp from './TradeUp';
import SCP from './SCP';
import Warranty from './Warranty';

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

export class AddedService {
    readonly icon: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly learnMoreLink: Locator;
    readonly appliedMessage: Locator;
    readonly appliedMessageToolTip: Locator;
    readonly editBtn: Locator;
    readonly removeBtn: Locator;
    readonly errorMessage: Locator;

    constructor(readonly section: Locator) {
        this.icon = this.section.locator('.service-item__icons img');
        this.name = this.section.locator('.service-item__name');
        this.description = this.section.locator('.service-item__description');
        this.learnMoreLink = this.section.locator('[data-an-la$=":learn more"]');
        this.appliedMessage = this.section.locator('.service-item__applied-message');
        this.appliedMessageToolTip = this.section.locator('.service-item__applied-message--toolTip');
        this.editBtn = this.section.locator('.action-icon--edit, [data-mat-icon-name="icon-regular-action-edit"]');
        this.removeBtn = this.section.locator('.service-item__remove--btn, [data-an-tr="cart-product-remove"], [data-an-la="remove item"]');
        this.errorMessage = this.section.locator('.service-item__error');
    }
}

/**
 * Cart item
 */
class CartItem {
    readonly productName: Locator;
    readonly productImage: Locator;
    readonly productSku: Locator;
    readonly description: Locator;
    readonly deliveryDate: Locator;
    readonly stockMessage: Locator;
    readonly vatLabel: Locator;

    readonly currentPrice: Locator;
    readonly actualPrice: Locator;
    readonly discountPrice: Locator;

    readonly removeBtn: Locator;
    readonly decreaseQuantityBtn: Locator;
    readonly quantityInput: Locator;
    readonly increaseQuantityBtn: Locator;

    readonly addTradeInBtn: Locator;
    readonly tradeIn: AddedService;

    readonly addTradeUpBtn: Locator;
    readonly tradeUp: AddedService;

    readonly addSCPBtn: Locator;
    readonly scp: AddedService;

    readonly addWarrantyBtn: Locator;
    readonly warranty: AddedService;

    readonly addGalaxyClubBtn: Locator;
    readonly galaxyClub: AddedService;

    readonly addSSFlexBtn: Locator;
    readonly ssFlex: AddedService;

    readonly addKnoxBtn: Locator;
    readonly knox: AddedService;

    readonly addDASubBtn: Locator;
    readonly daSub: AddedService;

    readonly addMCSBtn: Locator;
    readonly mcs: AddedService;

    readonly sim: AddedService;
    readonly broadband: AddedService;

    constructor(readonly section: Locator) {
        const page = this.section.page();
        this.productName = section.locator(page.locator('.cart-item__name, .cart-item__product-name'));
        this.productImage = section.locator(page.locator('.cart-item__thumb img'));
        this.productSku = section.locator(page.locator('.cart-item__sku'));
        this.description = section.locator(page.locator('.cart-item__desc'));
        this.deliveryDate = section.locator(page.locator('app-delivery-date'));
        this.stockMessage = section.locator(page.locator('.cart-item__stock'));
        this.vatLabel = section.locator(page.locator('.vat-label'));

        this.currentPrice = section.locator(page.locator('.price__current'));
        this.actualPrice = section.locator(page.locator('.price__actual'));
        this.discountPrice = section.locator(page.locator('.price__discount:visible'));

        this.removeBtn = this.section.locator('.cart-item__remove--btn');
        this.decreaseQuantityBtn = section.getByRole('button', { name: '-', exact: true });
        this.quantityInput = section.getByRole('textbox', { name: 'Quantity' }).or(section.locator('input.input-qty'));
        this.increaseQuantityBtn = section.getByRole('button', { name: '+', exact: true });

        this.addTradeInBtn = this.section.locator('[data-an-la="add service:trade-in"]');
        this.tradeIn = new AddedService(section.locator(`
            .service-item__trade-in,
            .service-item:has([data-an-la*="trade-in"]),
            [data-modelcode="TRADE-IN"]
        `));

        this.addTradeUpBtn = this.section.locator('[data-an-la="add service:trade-up"], [data-an-la="add service:tradeinTV"i]');
        this.tradeUp = new AddedService(section.locator(`
            .service-item__trade-up,
            .service-item__trade-in-tv,
            .service-item:has([data-an-la*="trade-up"], [data-an-la*="tradeinTV"i]),
            [data-modelcode="TRADE-UP"]
        `));

        this.addSCPBtn = this.section.locator('[data-an-la^="add service:samsung care"], [data-an-la="add service:SC"]');
        this.scp = new AddedService(section.locator(`
            .service-item__smc,
            .service-item:has([data-an-la*="samsung care"])
        `));

        this.addWarrantyBtn = this.section.locator('[data-an-la*="add service:warranty"], [data-an-la*="add service:EW"]');
        this.warranty = new AddedService(section.locator(`
            .service-item__smc,
            [data-pvisubtype="warranty"]
        `));

        this.addGalaxyClubBtn = this.section.locator('[data-an-la="add service:samsung galaxy club"]');
        this.galaxyClub = new AddedService(section.locator(`
            .service-item:has([title="Galaxy Club"i]),
            [data-modeldisplay="Galaxy Club"i],
            [data-pvisubtype="galaxy club"]
        `));

        this.addSSFlexBtn = this.section.locator('[data-an-la*="add service:upgrade"],[data-an-la="add service:samsung flex"]');
        this.ssFlex = new AddedService(section.locator(`
            .service-item__smf,
            .service-item:has([data-an-la*="samsung flex"])
        `));

        this.addKnoxBtn = this.section.locator('[data-an-la*="add service:knox_manage"]');
        this.knox = new AddedService(section.locator('.service-item:has([data-an-la*="knox_manage"])'));

        this.addDASubBtn = this.section.locator('[data-an-la="add service:replenishment"]');
        this.daSub = new AddedService(section.locator('.service-item:has(.replenishment-header)'));

        this.addMCSBtn = this.section.locator('[data-an-la="add service:mcs"]');
        this.mcs = new AddedService(section.locator('.service-item[data-modelname*="MCS"i])'));

        this.sim = new AddedService(section.locator('[data-pvisubtype="tariff"], [data-pimsubtype="tariff"], [data-modelcode*="SIM"i]'));
        this.broadband = new AddedService(section.locator('.service-item:has([src*="broadband"]), [data-modeldisplay="Broadband"i]'));
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
    readonly tradeIn: TradeIn;
    readonly tradeUp: TradeUp;
    readonly scp: SCP;
    readonly warranty: Warranty;

    readonly main: Locator;
    readonly itemCount: Locator;
    readonly cartItemList: Locator;
    readonly cartItems: CartItem;

    constructor(readonly page: Page) {
        this.api = new API(page);
        this.gnb = new GNB(page);
        this.empty = new EmptyCart(page);
        this.recommendation = new Recommendation(page.locator('main app-product-recommendation-v2'));
        this.rhs = new CartRHS(page.locator('.TokoRightContent'));
        this.tradeIn = new TradeIn(page);
        this.tradeUp = new TradeUp(page);
        this.scp = new SCP(page);
        this.warranty = new Warranty(page);

        this.main = page.locator('main');
        this.itemCount = page.locator('.item-count');
        this.cartItemList = page.locator('cx-cart-item-list-v2');
        this.cartItems = new CartItem(page.locator('cx-cart-item-v2'));
    }

    get url() {
        return this.page.context().cartURL;
    }

    async getCartId(): Promise<string | null> {
        return this.page.evaluate((storeID) => {
            return window.sessionStorage.ref || window.localStorage[`spartacus⚿${storeID}⚿cart`];
        }, this.page.context().storeID);
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

    cartItem(item?: string | number): CartItem {
        const items = this.page.locator('cx-cart-item-v2');
        if (typeof item === 'number') {
            return new CartItem(items.nth(item - 1));
        }
        const sku = this.page.locator(`[data-modelcode="${item}"]`);
        const name = this.page.locator(`.cart-item__name:has-text("${item}"), .cart-item__product-name:has-text("${item}")`);
        return new CartItem(items.filter({ has: sku.or(name) }));
    }

    async addTradeIn(item: string | number, data?: TradeInData) {
        const cartItem = this.cartItem(item);
        await cartItem.addTradeInBtn.click();
        await expect(this.tradeIn.modal).toBeVisible({ timeout: 10000 });
        await this.tradeIn.process(data);
        await expect(this.tradeIn.modal).toBeHidden();
        await expect(cartItem.tradeIn.removeBtn).toBeVisible({ timeout: 30000 });
    }

    async addSCP(item: string | number, option: number | string = 1, plan: number | string = 1) {
        const cartItem = this.cartItem(item);
        await cartItem.addSCPBtn.click();
        await expect(this.scp.modal).toBeVisible({ timeout: 10000 });
        await this.scp.option(option).click();
        await this.page.waitForTimeout(1000);
        await this.scp.checkTermsAndConditions();
        await this.page.waitForTimeout(1000);
        await this.scp.confirmBtn.click();
        await expect(this.scp.modal).toBeHidden();
        await expect(cartItem.scp.removeBtn).toBeVisible({ timeout: 30000 });
    }

    async applyCoupon(coupon: string) {
        await this.rhs.couponCodeInput.fill(coupon);
        await this.rhs.applyCouponBtn.click();
        await this.page.waitForTimeout(1000);
        await this.rhs.applyCouponSpinner.waitFor({ state: 'hidden' });
    }

    async clearCart() {
    }

    async waitForLoad() {
        try {
            await this.cartItemList.or(this.empty.section).waitFor({ timeout: 60000 });
            if (await this.cartItemList.isVisible()) {
                await this.rhs.totalAmount.waitFor({ timeout: 10000 });
            }
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
                await this.page.waitForFunction(e => !document.contains(e), btn, { timeout: 30000 }).catch(() => {
                    throw new Error('Checkout button is not working');
                });
                break;
            } catch (error) {
                if (tries == 2) throw error;
                await this.page.waitForTimeout(5000);
            }
        }
        await this.page.waitForURL(/guestlogin\/checkout|checkout\/one/);
        if (this.page.url().includes('guestlogin/checkout')) {
            const email = this.page.context().checkoutEmail;
            await this.page.fill('input[type="email"]', email);
            await this.page.click('[data-an-la="guest"]');
            await this.page.waitForURL(/checkout\/one/);
        }
        await this.page.waitForLoadState();
    }

    static async containSKU(this: ExpectMatcherState, cart: Cart, sku: string, options?: { timeout?: number }): Promise<MatcherReturnType> {
        try {
            await cart.cartItem(sku).section.waitFor({ timeout: options?.timeout ?? 15000 });
            return { pass: true, message: () => `SKU ${sku} is in cart` };
        } catch (e) {
            return { pass: false, message: () => `SKU ${sku} is not in cart` };
        }
    }
}
