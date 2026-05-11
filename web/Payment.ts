import type { Page } from 'fixtures';

export default class Payment {
    constructor(readonly page: Page) {
    }

    get url() {
        return this.page.context().checkoutURL + '?step=CHECKOUT_STEP_PAYMENT';
    }
}
