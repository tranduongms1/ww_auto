import type { Locator, Page } from 'playwright';

/**
 * Global Navigation Bar (both AEM and Hybrid)
 */
export default class GNB {
    private page: Page;

    constructor(readonly section: Locator) {
        this.page = section.page();
    }
}
