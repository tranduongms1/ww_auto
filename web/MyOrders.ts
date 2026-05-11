import { Locator } from 'playwright';
import type { Page } from 'fixtures';

export default class MyOrders {
    readonly orderHistory: Locator;
    readonly resultCount: Locator;
    readonly orderItems: Locator;
    readonly tradeInOrderItems: Locator;

    constructor(readonly page: Page) {
        this.orderHistory = page.locator('app-order-history');
        this.resultCount = page.locator('.order-history__result-count');
        this.orderItems = page.locator('app-order-item > .order-item, app-order-item-guest > .order-item');
        this.tradeInOrderItems = page.locator('.order-item:has(app-trade-in-item)');
    }

    get url() {
        return this.page.context().myOrdersURL;
    }

    orderItem(item?: string | number) {
        switch (typeof item) {
            case 'string':
                return new OrderItem(this.orderItems.filter({
                    has: this.page.locator(`.order-item__id:has-text("${item}")`)
                }));
            case 'number':
                return new OrderItem(this.orderItems.nth(item));
            default:
                return new OrderItem(this.orderItems);
        }
    }

    tradeInOrderItem(item?: string | number) {
        switch (typeof item) {
            case 'string':
                return new OrderItem(this.tradeInOrderItems.filter({
                    has: this.page.locator(`.order-item__id:has-text("${item}")`)
                }));
            case 'number':
                return new OrderItem(this.tradeInOrderItems.nth(item));
        }
    }
}

class OrderItem {
    readonly orderID: Locator;
    readonly orderDate: Locator;
    readonly orderStatus: Locator;
    readonly orderEntries: Locator;
    readonly viewDetailsBtn: Locator;
    readonly showLessBtn: Locator;

    constructor(readonly section: Locator) {
        this.orderID = section.locator('.order-item__id, .trade-in-item__id');
        this.orderDate = section.locator('.order-item__date, .trade-in-item__date');
        this.orderStatus = section.locator('.order-item-entry__order-status-text, .trade-in-item-entry__order-status-text');
        this.orderEntries = section.locator('app-order-item-entry');
        this.viewDetailsBtn = section.locator('[class*="view-detail-button"]:has([data-mat-icon-name*="arrow-down"])');
        this.showLessBtn = section.locator('[class*="view-detail-button"]:has([data-mat-icon-name*="arrow-up"])');
    }
}
