import type { Page } from 'fixtures';
import { SplashRHS } from './RHS';

/**
 * Splash page (Hybrid)
 */
export default class Splash {
    readonly rhs: SplashRHS;

    constructor(readonly page: Page) {
        this.rhs = new SplashRHS(page.locator('cx-page-slot[position="RightContentSlot"]'));
    }

    get url() {
        return this.page.context().splashURL();
    }
}
