import type { Locator } from 'playwright';

/**
 * Recommendation section (Hybrid)
 */
export default class Recommendation {
    readonly productCards: Locator;

    constructor(readonly section: Locator) {
        this.productCards = this.section.locator('app-product-v2');
    }
}
