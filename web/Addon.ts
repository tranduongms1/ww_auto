import type { Locator, Page } from 'playwright';

/**
 * Add-on page (both BC and PD)
 */
export default class AddOn {
    readonly section: Locator;

    readonly categoryList: Locator;
    readonly categoryItems: Locator;
    readonly productLists: Locator;
    readonly productItems: Locator;

    readonly skipBtn: Locator;
    readonly continueBtn: Locator;

    constructor(readonly page: Page) {
        this.section = page.locator('.hubble-addon-page:visible');

        this.categoryList = page.locator('.hubble-addon-page__category-list');
        this.categoryItems = page.locator('.hubble-addon-page__category-item');
        this.productLists = page.locator('.hubble-addon-page__list');
        this.productItems = page.locator('.hubble-addon-page__item');

        this.skipBtn = page.locator(`
            [an-la='evoucher:no addition:skip'],
            [an-la='evoucher:below evoucher:back'],
            [an-la="evoucher:over evoucher:continue"]
            [an-la="free gift:skip"]
        `);
        this.continueBtn = page.locator(`
            [an-la='add-on:continue'],
            [an-la='add-on:go to cart'],
            [an-la='free gift:continue'],
            #giftContinue,
            [an-la='evoucher:continue'],
            [an-la='evoucher:go to cart'],
            [id='nextBtn'],
            [id='primaryInfoGoCartAddOn']
        `);
    }

    category(codeOrIndex: string | number): Locator {
        if (typeof codeOrIndex === 'number') {
            return this.categoryItems.nth(codeOrIndex - 1);
        }
        return this.categoryItems.filter({ has: this.page.locator(`[data-categroy-code="${codeOrIndex}"]`) });
    }

    get addableProducts(): Product {
        return new Product(this.productItems.filter({ has: this.page.locator('[an-la^="add-on:"][an-la$=":add item"]') }));
    }
}

class Product {
    readonly addBtn: Locator;

    constructor(readonly card: Locator) {
        this.addBtn = card.locator('[an-la$=":add item"]');
    }
}
