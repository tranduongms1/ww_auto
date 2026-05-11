import type { Locator, Page } from 'playwright';

export interface SMCOption extends Locator {
    name: Locator;
    code: Locator;
    priceText: Locator;
}

export default class SCP {
    readonly modal: Locator;
    readonly title: Locator;
    readonly xButton: Locator;
    readonly optionLocator: Locator;
    readonly options: SMCOption;
    readonly termsAndConditions: Locator;
    readonly confirmBtn: Locator;

    constructor(readonly page: Page) {
        this.modal = this.page.locator(`
            #hubble-care-layer,
            app-samsung-care,
            app-samsung-care-v2
        `);
        this.title = this.modal.locator(page.locator('.hubble-pd-popup__title, modal__title'));
        this.xButton = this.modal.locator(page.locator('.hubble-pd-popup__close, modal__close'));
        this.optionLocator = this.modal.locator('.option-box');
        this.options = this.smcOption(this.optionLocator);
        this.termsAndConditions = this.modal.locator(page.getByRole('checkbox'));
        this.confirmBtn = this.modal.locator(page.locator(`
            [an-la="samsung care:confirm"],
            [data-an-la="samsung care:confirm"]
        `));
    }

    private smcOption(locator: Locator): SMCOption {
        return Object.assign(locator, {
            name: locator.locator('.option-box__name'),
            code: locator.locator('.option-box__code'),
            priceText: locator.locator('.option-box__price'),
        });
    }

    option(option: number | string = 1): SMCOption {
        return this.smcOption(typeof option === 'number'
            ? this.optionLocator.nth(option - 1)
            : this.optionLocator.filter({ has: this.page.locator(`.smc-option__name:text-is("${option}"), .smc-option__code:text-is("${option}")`) })
        );
    }

    async checkTermsAndConditions() {
        for (const term of await this.termsAndConditions.all()) {
            await term.evaluate(e => e.scrollIntoView({ block: 'center' }), { timeout: 3000 }).catch(() => { });
            await term.check({ force: true });
        }
    }
}
