import { Locator } from 'playwright';
import { Page } from 'fixtures';

import GNB from './GNB';

/**
 * Product Finder page (AEM)
 */
export default class PF {
    readonly gnb: GNB;

    readonly productCards: Locator;
    readonly viewMoreBtn: Locator;

    constructor(readonly page: Page) {
        this.gnb = new GNB(page);

        this.productCards = page.locator('.js-pfv2-product-card, .js-pf-product-card');
        this.viewMoreBtn = page.locator('[an-la="view more"]:visible');
    }

    /**
     * Get a product card by display name or index
     * @param item - Display name or index of the product card
     * @returns ProductCard
     */
    productCard(item: string | number) {
        switch (typeof item) {
            case 'string':
                return new ProductCard(this.productCards.filter({
                    has: this.page.locator(`[an-la*="display name"][aria-label="${item}"], [an-la*="display name"][aria-label="Add to basket:${item}"]`)
                }));
            case 'number':
                return new ProductCard(this.productCards.nth(item - 1));
        }
    }
}

class ProductCard {
    readonly productImage: Locator;
    readonly productName: Locator;
    readonly colors: Locator;
    readonly options: Locator;
    readonly buyNowBtn: Locator;
    readonly stockAlertBtn: Locator;
    readonly addToWishlistBtn: Locator;

    constructor(readonly card: Locator) {
        this.productImage = this.card.locator('[an-la="image click"]');
        this.productName = this.card.locator('[an-la="display name click"]');
        this.colors = this.card.locator('[an-la*="color"]');
        this.options = this.card.locator('[an-la*="mobile memory"], [an-la*="tv size"]');
        this.buyNowBtn = this.card.locator('[an-la*="pf product card:buy"], [an-la*="pf product card:add to cart"], [an-la="pf product card:pre order"], [an-la="pf product card:notify me"]');
        this.stockAlertBtn = this.card.locator('[an-la="stock alert"], [an-la="pf product card:notify me"]');
        this.addToWishlistBtn = this.card.locator('[an-la="add to wishlist"]')
    }
}
