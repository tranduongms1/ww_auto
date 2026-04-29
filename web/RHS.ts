import type { Locator } from 'playwright';

class OrderSummary {
    readonly summary: Locator;
    readonly summaryHeading: Locator;
    readonly summaryRows: Locator;

    readonly totalSummary: Locator;
    readonly totalAmount: Locator;

    readonly tieringMessage: Locator;
    readonly rewardsBenefit: Locator;

    constructor(readonly section: Locator) {
        this.summary = this.section.locator('.cx-summary-total');
        this.summaryHeading = this.summary.getByRole('heading');
        this.summaryRows = this.summary.locator('.cx-summary-row');

        this.totalSummary = this.section.locator('.cx-summary-first-item');
        this.totalAmount = this.section.locator('.summary-total__amount');

        this.tieringMessage = this.section.locator('.summary-tiering-message');
        this.rewardsBenefit = this.section.locator('.summary-rewards-benefit');
    }
}

/**
 * Cart Right Hand Side (RHS)
 */
export class CartRHS extends OrderSummary {
    readonly checkoutBtn: Locator;
    readonly guestCheckoutBtn: Locator;
    readonly expressCheckoutBtn: Locator;

    readonly termsAndConditions: Locator;
    readonly reasonsToBuy: Locator;

    constructor(readonly section: Locator) {
        super(section);

        this.checkoutBtn = this.section.locator('[data-an-la="proceed to checkout"]:visible');
        this.guestCheckoutBtn = this.section.locator('[data-an-la^="proceed to checkout:"][data-an-la*="guest"]:visible');
        this.expressCheckoutBtn = this.checkoutBtn;

        this.termsAndConditions = this.section.locator('app-terms-conditions:visible');
        this.reasonsToBuy = this.section.locator('app-highlight-offers');
    }
}

/**
 * Splash Right Hand Side (RHS)
 */
export class SplashRHS extends OrderSummary {
    constructor(readonly section: Locator) {
        super(section);
    }
}

/**
 * Checkout Right Hand Side (RHS)
 */
export class CheckoutRHS extends OrderSummary {
    constructor(readonly section: Locator) {
        super(section);
    }
}
