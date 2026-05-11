import type { Locator } from 'playwright';
import type { Page } from 'fixtures';
import type { Checkbox } from './Form';

import Address from './Address';
import CustomerInfo from './CustomerInfo';
import { CheckoutRHS } from './RHS';

/**
 * Checkout page (Hybrid)
 */
class Checkout {
    readonly customerInfo: CustomerInfo;
    readonly shippingAddress: ShippingAddress;
    readonly billingAddress: BillingAddress;
    readonly rhs: CheckoutRHS;

    constructor(readonly page: Page) {
        this.customerInfo = new CustomerInfo(page.locator('app-customer-info-v2'));
        this.shippingAddress = new ShippingAddress(page.locator('app-customer-address-v2'));
        this.billingAddress = new BillingAddress(page.locator('app-billing-address-v2'));
        this.rhs = new CheckoutRHS(page.locator('.RightContentCheckoutSlot'));
    }

    get url() {
        return this.page.context().checkoutURL;
    }

    async applyCoupon(coupon: string) {
        await this.rhs.couponCodeInput.fill(coupon);
        await this.rhs.applyCouponBtn.click();
        await this.page.waitForTimeout(1000);
        await this.rhs.applyCouponSpinner.waitFor({ state: 'hidden' });
    }

    async waitForLoad() {
        await this.rhs.totalAmount.waitFor();
    }
}

export class ShippingAddress extends Address {
    readonly savedAddressRadio: Locator;
    readonly newAddressRadio: Locator;
    readonly manualAddressBtn: Locator;
    readonly viaSearchAdressBtn: Locator;
    readonly saveAddressCbx: Checkbox;

    readonly savedAddressesList: Locator;
    readonly savedAddresses: Locator;
    readonly saveChangeBtn: Locator;
    readonly cancelBtn: Locator;

    constructor(form: Locator) {
        super(form);
        this.savedAddressRadio = form.locator(':has(> [value="SAVED_ADDRESS"]):visible');
        this.newAddressRadio = form.locator(':has(> [value="NEW_ADDRESS"]):visible');
        this.manualAddressBtn = form.locator('[data-an-la="checkout:customer details:enter address manually"]:visible');
        this.viaSearchAdressBtn = form.locator('[data-an-la="checkout:customer details:enter address via search"]:visible');
        this.saveAddressCbx = this.checkbox('saveInAddressBook');

        this.savedAddressesList = form.locator('app-address-list-v2');
        this.savedAddresses = this.savedAddressesList.locator('.address-box:visible');
        this.saveChangeBtn = form.locator('[data-an-la="checkout:customer details:save change"]');
        this.cancelBtn = form.locator('[data-an-la="checkout:customer details:cancel"]');
    }
}

export class BillingAddress extends ShippingAddress {
    readonly sameAsShippingAddressCbx: Checkbox;
    readonly taxInvoiceCbx: Checkbox;
    readonly personalInvoiceCbx: Checkbox;
    readonly companyInvoiceCbx: Checkbox;

    constructor(form: Locator) {
        super(form);
        this.sameAsShippingAddressCbx = this.checkbox('sameAsShipping');
        this.taxInvoiceCbx = this.checkbox('isUserWantTaxInvoice');
        this.personalInvoiceCbx = this.checkbox('personalInvoice');
        this.companyInvoiceCbx = this.checkbox('companyInvoice');
    }
}

export default Checkout;
