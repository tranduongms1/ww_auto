import type { Locator } from 'playwright';
import type { Page } from 'fixtures';

import GNB from './GNB';

/**
 * Buy Configuration page (AEM)
 */
export default class BC {
    readonly gnb: GNB;

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

    public product?: Product;

    constructor(readonly page: Page) {
        this.gnb = new GNB(page);

        this.addToCartBtn = page.getByRole('button').and(page.locator(`
            [an-la*='sticky bar:add to cart'],
            [an-la*='sticky bar:continue'],
            [an-la*='sticky bar:buy now'],
            [an-la*='sticky bar:pre order'],
            [an-la*='sticky bar:buy with subscription'],
            [an-la*='secondary:buy with subscription']
        `));
        this.getStockAlertBtn = page.getByRole('button').and(page.locator('[an-la="top sticky bar:stock alert"]'));

        this.tradeInSection = page.locator('#trade-in');
        this.tradeInYesOpt = this.page.locator(`
            .s-option-trade [an-la='trade-in:yes'i]:visible,
            .wearable-option.trade-in [an-la='trade-in:yes'i]
        `);
        this.tradeInNoOpt = this.page.locator(`
            .s-option-trade [an-la='trade-in:no'i],
            .wearable-option.trade-in [an-la='trade-in:no'i]
        `);
        this.addOtherTradeInBtn = this.page.locator('[an-la="trade-in:add another trade-in"]:visible');
        this.removeTradeInBtn = this.page.locator('[an-la="trade-in:delete"]:visible');

        this.scpSection = page.locator('#samsung-care');
        this.scpOpts = this.page.locator(`
            .hubble-product__options-list-wrap:not([style*="hidden"]) .js-smc,
            .wearable-option.option-care li:not(.depth-two) :not([an-la*='none']),
            .smc-list .insurance__item--yes,
            .watch-bc-buyflow__option-item:not(:has([an-la*="no"]))
        `);
        this.scpNoneOpt = this.page.locator(`
            .hubble-product__options-list-wrap:not([style*="hidden"]) .js-smc-none,
            .wearable-option.option-care [an-la="samsung care:none"],
            .smc-list .insurance__item--no,
            .watch-bc-buyflow__option-item [an-la="samsung care:no"]
        `);

        this.simSection = page.locator('#tariff, #offer_tariff');
        this.simOpts = this.simSection.locator('.s-option-box:visible');
        this.addSimBtn = this.page.locator('[an-la="tariff:apply"]');
        this.removeSIMBtn = this.page.locator('[an-la="tariff:remove"]');

        this.flexSection = page.locator('#flex');
        this.flexOpts = this.page.locator('[an-la="purchase program:upgrade program"]');
        this.addFlexBtn = this.page.locator('[an-la*="upgrade program:apply"]:visible');

        this.galaxyClubSection = page.locator('#galaxy-club');
        this.addGalaxyClubBtn = this.page.locator('[an-la="samsung galaxy club:join now"], [an-la="samsung galaxy club:jetzt mitglied werden"]');
        this.galaxyClubNoOpt = this.page.locator(`.s-option-galaxy-club [id='gc-no-btn']`);
    }

    async continueToCart() {
        await this.addToCartBtn.click();
    }

    async waitForLoad() {
        try {
            await this.addToCartBtn.or(this.getStockAlertBtn).waitFor({ timeout: 30000 });
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
