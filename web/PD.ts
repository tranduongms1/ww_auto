import type { Locator } from 'playwright';
import type { Page } from 'fixtures';

import GNB from './GNB';

/**
 * Product Detail page (AEM)
 */
export default class PD {
    readonly gnb: GNB;

    readonly addToCartBtn: Locator;
    readonly getStockAlertBtn: Locator;

    readonly tradeInSection: Locator;

    readonly tradeUpSection: Locator;

    readonly scpSection: Locator;

    readonly warrantySection: Locator;

    public product?: Product;

    constructor(readonly page: Page) {
        this.gnb = new GNB(page.locator('nav[aria-label="main navigation"]'));

        this.addToCartBtn = page.getByRole('link').and(page.locator(`
            [an-la="secondary nav:add to cart"i],
            [an-la="secondary navi:add to cart"i],
            [an-la="secondary nav:pre order"],
            [an-la="anchor navi:add to cart"],
            [an-la="anchor navi:pre-order"],
            [an-la="anchor navi:buy now"]
        `)).first();
        this.getStockAlertBtn = page.locator('[an-la="stock alert"]:visible');

        this.tradeInSection = page.locator('#trade-in');

        this.tradeUpSection = page.locator('#trade-up');

        this.scpSection = page.locator('.option-care');

        this.warrantySection = page.locator('.option-warranty-vd');
    }

    async continueToCart() {
    }

    async waitForLoad() {
        try {
            await this.addToCartBtn.or(this.getStockAlertBtn).waitFor({ timeout: 30000 });
        } catch (error) {
            throw new Error('PD page is not loaded successfully');
        }
    }

    async waitForAddToCartButton() {
        await this.waitForLoad();
        if (await this.getStockAlertBtn.isVisible()) {
            if (this.product) {
                this.product.canBuy = false;
                throw new Error(`Product ${this.product.sku} is out of stock`);
            }
            throw new Error('Product is out of stock');
        }
        if (await this.addToCartBtn.isDisabled()) {
            if (this.product) {
                this.product.canBuy = false;
                throw new Error(`"Add to Cart" button is not clickable for product ${this.product.sku}`);
            }
            throw new Error('"Add to Cart" button is not clickable');
        }
    }

    private async waitForSection(name: string, locator: Locator, setup: string) {
        try {
            await locator.waitFor({ timeout: 30000 });
        } catch (error) {
            if (this.product) {
                Object.assign(this.product, { [setup]: false });
                throw new Error(`${name} section is not displayed for product ${this.product.sku}`);
            }
            throw new Error(`${name} section is not displayed`);
        }
    }

    async waitForTradeInSection() {
        await this.waitForSection('Trade In', this.tradeInSection, 'tradeIn');
    }

    async waitForSCPSection() {
        await this.waitForSection('SC+', this.scpSection, 'scp');
    }
}
