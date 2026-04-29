import { Page } from 'fixtures';

import GNB from './GNB';

/**
 * Product Finder page (AEM)
 */
export default class PF {
    readonly gnb: GNB;

    constructor(readonly page: Page) {
        this.gnb = new GNB(page);
    }
}
