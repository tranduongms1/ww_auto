import type { Page } from 'fixtures';

/**
 * Delivery page (Hybrid)
 */
export default class Delivery {
    constructor(readonly page: Page) {
    }

    get url() {
        return this.page.context().checkoutURL() + '?step=CHECKOUT_STEP_DELIVERY';
    }
}
