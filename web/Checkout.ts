import type { Page } from 'fixtures';

import { CheckoutRHS } from './RHS';

/**
 * Checkout page (Hybrid)
 */
export default class Checkout {
    readonly rhs: CheckoutRHS;

    constructor(readonly page: Page) {
        this.rhs = new CheckoutRHS(page.locator('cx-page-slot[position="TokoRightContent"]'));
    }

    get url() {
        return this.page.context().checkoutURL();
    }
}
