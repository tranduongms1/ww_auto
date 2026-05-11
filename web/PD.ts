import { expect, Locator } from 'playwright/test';
import type { Page } from 'fixtures';
import type { Product } from './product';

import { selectCountry } from './common';
import GNB from './GNB';
import TradeIn from './TradeIn';
import TradeUp from './TradeUp';
import SCP from './SCP';
import Warranty from './Warranty';
import Addon from './Addon';

/**
 * Product Detail page (AEM)
 */
export default class PD {
    readonly gnb: GNB;
    readonly tradeIn: TradeIn;
    readonly tradeUp: TradeUp;
    readonly scp: SCP;
    readonly warranty: Warranty;
    readonly addOn: Addon;

    readonly addToCartBtn: Locator;
    readonly getStockAlertBtn: Locator;

    readonly tradeInSection: Locator;
    readonly tradeInYesOpt: Locator;
    readonly tradeInNoOpt: Locator;

    readonly tradeUpSection: Locator;
    readonly tradeUpYesOpt: Locator;

    readonly scpSection: Locator;
    readonly scpNoneOpt: Locator;
    readonly scpOpts: Locator;

    readonly warrantySection: Locator;
    readonly warrantyYesOpt;

    public product?: Product;

    constructor(readonly page: Page) {
        this.gnb = new GNB(page);
        this.tradeIn = new TradeIn(page);
        this.tradeUp = new TradeUp(page);
        this.scp = new SCP(page);
        this.warranty = new Warranty(page);
        this.addOn = new Addon(page);

        this.addToCartBtn = page.locator(`
            [an-la="secondary nav:add to cart"i],
            [an-la="secondary navi:add to cart"i],
            [an-la="secondary nav:pre order"],
            [an-la="anchor navi:add to cart"],
            [an-la="anchor navi:pre-order"],
            [an-la="anchor navi:buy now"]
        `).filter({ visible: true }).last();
        this.getStockAlertBtn = page.locator('[an-la="stock alert"]:visible');

        this.tradeInSection = page.locator('#trade-in:has([an-la="trade-in:yes"i])');
        this.tradeInYesOpt = page.locator('.pd-option-selector:has([an-la="trade-in:yes"i])');
        this.tradeInNoOpt = page.locator('.pd-option-selector:has([an-la="trade-in:no"i])');

        this.tradeUpSection = page.locator('#trade-up, #trade-in:has([an-la="trade-up:yes"i])');
        this.tradeUpYesOpt = page.locator('.pd-option-selector:has([an-la="trade-up:yes"i])');

        this.scpSection = page.locator('.option-care');
        this.scpNoneOpt = page.locator('.pd-select-option__item:has([an-la*="samsung care:no"])');
        this.scpOpts = page.getByRole('listitem').filter({ has: page.locator('[an-la="samsung care:yes"], [an-la="samsung care:accidental damage protection"]') });

        this.warrantySection = page.locator('.option-warranty-vd');
        this.warrantyYesOpt = page.locator('.pd-select-option__item:has([an-la="extended warranty:yes"])');
    }

    async isTradeInOptionSelectable(): Promise<boolean> {
        if (!await this.tradeInNoOpt.isVisible()) return false;
        const disabled = await this.tradeInNoOpt.evaluate(e =>
            e.className.includes('disabled') ||
            e.ariaDisabled === 'true' ||
            window.getComputedStyle(e).pointerEvents === 'none'
        );
        return !disabled;
    }

    async addTradeIn() {
        await this.tradeInYesOpt.click();
        await expect(this.tradeIn.modal).toBeVisible({ timeout: 10000 });
        await this.tradeIn.process();
        await expect(this.tradeIn.modal).toBeHidden();
    }

    async isTradeUpOptionSelectable(): Promise<boolean> {
        if (!await this.tradeUpYesOpt.isVisible()) return false;
        const disabled = await this.tradeUpYesOpt.evaluate(e =>
            e.className.includes('disabled') ||
            e.ariaDisabled === 'true' ||
            window.getComputedStyle(e).pointerEvents === 'none'
        );
        return !disabled;
    }

    async addTradeUp() {
        await this.tradeUpYesOpt.click();
        await expect(this.tradeUp.modal).toBeVisible({ timeout: 10000 });
        await this.tradeUp.process();
        await expect(this.tradeUp.modal).toBeHidden();
    }

    async shouldSelectSCP() {
        const opts = this.scpOpts.filter({ visible: true });
        if (await opts.count() === 0) return false;
        if (await this.scpNoneOpt.evaluate(e => e.querySelector('[aria-disabled="true"], .js-smc-none.cta--disabled'))) return false;
        for (const opt of await opts.all()) {
            if (await opt.evaluate(e => e.classList.contains('selected'))) return false;
        }
        return true;
    }

    async addWarranty() {
        await this.warrantyYesOpt.click();
        await expect(this.warranty.modal).toBeVisible({ timeout: 10000 });
        await this.warranty.option(1).click();
        await this.page.waitForTimeout(1000);
        await this.warranty.checkTermsAndConditions();
        await this.page.waitForTimeout(1000);
        await this.warranty.confirmBtn.click();
        await expect(this.warranty.modal).toBeHidden();
    }

    async continueToCart() {
        for (let tries = 1; tries <= 2; tries++) {
            try {
                if (this.page.url().includes('/cart')) break;

                if (await this.shouldSelectSCP()) {
                    await this.scpNoneOpt.click();
                    console.log('SCP None option selected');
                }

                if (await this.addToCartBtn.isVisible()) {
                    const btn = await this.addToCartBtn.elementHandle({ timeout: 5000 });
                    await btn!.click();
                    console.log('Add to cart button clicked');
                    await btn!.waitForElementState('hidden', { timeout: 30000 }).catch((e) => {
                        if (e.message?.includes('not attached to the DOM')) return;
                        throw new Error('Add to cart button is not working');
                    });
                }
            } catch (error) {
                if (tries == 2) throw error;
                await this.page.waitForTimeout(tries * 2000);
            }
        }
        await selectCountry(this.page);
    }

    async waitForLoad() {
        try {
            await this.addToCartBtn.or(this.getStockAlertBtn).waitFor({ timeout: 60000 });
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

    async waitForTradeUpSection() {
        await this.waitForSection('Trade Up', this.tradeUpSection, 'tradeUp');
    }

    async waitForSCPSection() {
        await this.waitForSection('SC+', this.scpSection, 'scp');
    }

    async waitForWarrantySection() {
        await this.waitForSection('Warranty', this.warrantySection, 'warranty');
    }
}
