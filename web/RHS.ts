import type { Locator } from 'playwright';
import { FormField } from './Form';

class OrderSummary {
    readonly summary: Locator;
    readonly summaryHeading: Locator;
    readonly summaryRows: Locator;

    readonly totalSummary: Locator;
    readonly totalAmount: Locator;

    readonly tieringMessage: Locator;
    readonly rewardsBenefit: Locator;

    constructor(readonly section: Locator) {
        this.summary = section.locator('.cx-summary-total');
        this.summaryHeading = this.summary.getByRole('heading');
        this.summaryRows = this.summary.locator('.cx-summary-row');

        this.totalSummary = section.locator('.cx-summary-first-item');
        this.totalAmount = section.locator('.summary-total__amount');

        this.tieringMessage = section.locator('.summary-tiering-message');
        this.rewardsBenefit = section.locator('.summary-rewards-benefit');
    }
}

function couponFormField(section: Locator) {
    const coupon = section.locator('cx-cart-coupon-v2');
    return Object.assign(
        coupon.getByRole('textbox'), {
        label: coupon.locator('label'),
        errorMessage: coupon.locator('mat-error:visible'),
        clearBtn: coupon.locator('.clear-btn')
    }) as FormField;
}

/**
 * Cart Right Hand Side (RHS)
 */
export class CartRHS extends OrderSummary {
    readonly couponCodeInput: FormField;
    readonly applyCouponBtn: Locator;
    readonly applyCouponSpinner: Locator;

    readonly checkoutBtn: Locator;
    readonly guestCheckoutBtn: Locator;
    readonly expressCheckoutBtn: Locator;

    readonly termsAndConditions: Locator;
    readonly reasonsToBuy: Locator;

    constructor(readonly section: Locator) {
        super(section);

        this.couponCodeInput = couponFormField(section);
        this.applyCouponBtn = section.locator('[data-an-la="coupon:apply"], [data-an-la="promo code:apply"]');
        this.applyCouponSpinner = section.locator('cx-cart-coupon-v2 mat-spinner');

        this.checkoutBtn = section.locator('[data-an-la="proceed to checkout"]:visible');
        this.guestCheckoutBtn = section.locator('[data-an-la^="proceed to checkout:"][data-an-la*="guest"]:visible');
        this.expressCheckoutBtn = this.checkoutBtn;

        this.termsAndConditions = section.locator('app-terms-conditions:visible');
        this.reasonsToBuy = section.locator('app-highlight-offers');
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
    readonly couponCodeInput: FormField;
    readonly applyCouponBtn: Locator;
    readonly applyCouponSpinner: Locator;

    constructor(readonly section: Locator) {
        super(section);

        this.couponCodeInput = couponFormField(section);
        this.applyCouponBtn = section.locator('[data-an-la="coupon:apply"], [data-an-la="promo code:apply"]');
        this.applyCouponSpinner = section.locator('cx-cart-coupon-v2 mat-spinner');
    }
}
