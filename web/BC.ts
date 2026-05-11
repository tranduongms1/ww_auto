import type { Locator } from 'playwright';
import { expect, Page } from 'fixtures';
import type { Product } from './product';

import { selectCountry } from './common';
import GNB from './GNB';
import TradeIn from './TradeIn';
import SCP from './SCP';
import Addon from './Addon';

/**
 * Buy Configuration page (AEM)
 */
export default class BC {
    readonly gnb: GNB;
    readonly tradeIn: TradeIn;
    readonly scp: SCP;
    readonly addOn: Addon;

    readonly addToCartBtn: Locator;
    readonly getStockAlertBtn: Locator;

    readonly tradeInSection: Locator;
    readonly tradeInYesOpt: Locator;
    readonly tradeInNoOpt: Locator;
    readonly addOtherTradeInBtn: Locator;
    readonly removeTradeInBtn: Locator;

    readonly scpSection: Locator;
    readonly scpOpts: Locator;
    readonly scpNoneOpt: Locator;
    readonly scpPlans: Locator;

    readonly simSection: Locator;
    readonly simOpts: Locator;
    readonly addSimBtn: Locator;
    readonly removeSIMBtn: Locator;

    readonly flexSection: Locator;
    readonly flexOpts: Locator;
    readonly addFlexBtn: Locator;

    readonly galaxyClubSection: Locator;
    readonly addGalaxyClubBtn: Locator;
    readonly galaxyClubNoOpt: Locator;

    readonly mboSection: Locator;
    readonly mboAddBtn: Locator;

    public product?: Product;

    constructor(readonly page: Page) {
        this.gnb = new GNB(page);
        this.tradeIn = new TradeIn(page);
        this.scp = new SCP(page);
        this.addOn = new Addon(page);

        this.addToCartBtn = page.getByRole('button').and(page.locator(`
            [an-la*='sticky bar:add to cart'],
            [an-la*='sticky bar:continue'],
            [an-la*='sticky bar:buy now'],
            [an-la*='sticky bar:pre order'],
            [an-la*='sticky bar:buy with subscription'],
            [an-la*='secondary:buy with subscription']
        `));
        this.getStockAlertBtn = page.getByRole('button').and(page.locator('[an-la="top sticky bar:stock alert"]'));

        this.tradeInSection = page.locator('#trade-in, .wearable-option.trade-in');
        this.tradeInYesOpt = page.locator(`
            .s-option-trade [an-la='trade-in:yes'i]:visible,
            .wearable-option [an-la='trade-in:yes'i]
        `);
        this.tradeInNoOpt = page.locator(`
            .s-option-trade [an-la='trade-in:no'i],
            .wearable-option.trade-in [an-la='trade-in:no'i]
        `);
        this.addOtherTradeInBtn = page.locator('[an-la="trade-in:add another trade-in"]:visible');
        this.removeTradeInBtn = page.locator('[an-la="trade-in:delete"]:visible');

        this.scpSection = page.locator('#samsung-care');
        this.scpOpts = page.locator(`
            .hubble-product__options-list-wrap:not([style*="hidden"]) .js-smc,
            .wearable-option.option-care li:not(.depth-two) :not([an-la*='none']),
            .smc-list .insurance__item--yes,
            .watch-bc-buyflow__option-item:not(:has([an-la*="no"]))
        `);
        this.scpNoneOpt = page.locator(`
            .hubble-product__options-list-wrap:not([style*="hidden"]) .js-smc-none,
            .wearable-option.option-care [an-la="samsung care:none"],
            .smc-list .insurance__item--no,
            .watch-bc-buyflow__option-item [an-la="samsung care:no"]
        `);
        this.scpPlans = page.locator('.hubble-product__options-payment:visible').locator('.s-option-box');

        this.simSection = page.locator('#tariff, #offer_tariff');
        this.simOpts = this.simSection.locator('.s-option-box:visible');
        this.addSimBtn = page.locator('[an-la="tariff:apply"]');
        this.removeSIMBtn = page.locator('[an-la="tariff:remove"]');

        this.flexSection = page.locator('#flex');
        this.flexOpts = page.locator('[an-la="purchase program:upgrade program"]');
        this.addFlexBtn = page.locator('[an-la*="upgrade program:apply"]:visible');

        this.galaxyClubSection = page.locator('#galaxy-club');
        this.addGalaxyClubBtn = page.locator('[an-la="samsung galaxy club:join now"], [an-la="samsung galaxy club:jetzt mitglied werden"]');
        this.galaxyClubNoOpt = page.locator(`.s-option-galaxy-club [id='gc-no-btn']`);

        this.mboSection = page.locator('#offer_together');
        this.mboAddBtn = page.locator('[an-la="multi buy offer:add item"]');
    }

    async isTradeInOptionSelectable() {
        if (!await this.tradeInNoOpt.isVisible()) return false;
        const disabled = await this.tradeInNoOpt.evaluate(e =>
            e.className.includes('disabled') ||
            e.ariaDisabled === 'true' ||
            window.getComputedStyle(e).pointerEvents === 'none'
        );
        return !disabled;
    }

    async addTradeIn(data?: TradeInData) {
        await this.tradeInYesOpt.click();
        await expect(this.tradeIn.modal).toBeVisible({ timeout: 10000 });
        await this.tradeIn.process(data);
        await expect(this.tradeIn.modal).toBeHidden();
        await expect(this.removeTradeInBtn).toBeVisible({ timeout: 30000 });
    }

    async shouldSelectSCP() {
        const opts = this.scpOpts.filter({ visible: true });
        if (await opts.count() === 0) return false;
        if (await this.scpNoneOpt.evaluate(e => e.querySelector('[aria-disabled="true"], .js-smc-none.cta--disabled'))) return false;
        for (const opt of await opts.all()) {
            if (await opt.evaluate(e => e.classList.contains('is-checked'))) return false;
        }
        return true;
    }

    async addSCP(option: number | string = 1, plan: number | string = 1): Promise<[Locator, Locator | undefined]> {
        const optionLocator = typeof option === 'number' ? this.scpOpts.nth(option - 1) : this.scpOpts.locator(option);
        await optionLocator.click();
        await expect(optionLocator).toContainClass('is-checked');
        await expect(this.scpPlans.first().or(this.scp.modal)).toBeVisible();
        let planLocator = undefined;
        if (await this.scpPlans.first().isVisible()) {
            planLocator = typeof plan === 'number' ? this.scpPlans.nth(plan - 1) : this.scpPlans.locator(plan);
            await planLocator.click();
            await expect(planLocator).toContainClass('is-checked');
        }
        await expect(this.scp.modal).toBeVisible();
        await this.scp.checkTermsAndConditions();
        await this.scp.confirmBtn.click();
        await expect(this.scp.modal).toBeHidden();
        await expect(optionLocator).toContainClass('is-checked');
        if (planLocator) await expect(planLocator).toContainClass('is-checked');
        return [optionLocator, planLocator];
    }

    async continueToCart() {
        for (let tries = 1; tries <= 3; tries++) {
            try {
                if (this.page.url().includes('/cart')) break;

                if (await this.isTradeInOptionSelectable()) {
                    await this.tradeInNoOpt.click();
                    console.log('Trade In No option selected');
                }

                if (await this.galaxyClubNoOpt.isVisible()) {
                    await this.galaxyClubNoOpt.click();
                    console.log('Galaxy Club No option selected');
                }

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

                if (await this.addOn.skipBtn.isVisible()) {
                    await this.addOn.skipBtn.click();
                    console.log('Skip button clicked');
                }

                if (await this.addOn.continueBtn.isVisible()) {
                    await this.addOn.continueBtn.click();
                    console.log('Continue button clicked');
                }
            } catch (error) {
                if (tries == 2) throw error;
                await this.page.waitForTimeout(tries * 2000);
            }
            await selectCountry(this.page);
        }
    }

    async waitForLoad() {
        try {
            await this.addToCartBtn.or(this.getStockAlertBtn).waitFor({ timeout: 60000 });
        } catch (error) {
            throw new Error('BC page is not loaded successfully');
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

    async waitForStockAlertButton() {
        await this.waitForLoad();
        if (await this.getStockAlertBtn.isHidden()) {
            if (this.product) {
                this.product.outOfStock = false;
                throw new Error(`Get Stock Alert button is not show for product ${this.product.sku}`);
            }
            throw new Error('Get Stock Alert button is not show');
        }
    }

    async waitForSection(name: string, locator: Locator, setup: string) {
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

    async waitForSimSection() {
        await this.waitForSection('SIM', this.simSection, 'sim');
    }

    async waitForFlexSection() {
        await this.waitForSection('Flex', this.flexSection, 'flex');
    }

    async waitForGalaxyClubSection() {
        await this.waitForSection('Galaxy Club', this.galaxyClubSection, 'galaxyClub');
    }
}
