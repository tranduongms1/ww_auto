import type { Locator } from 'playwright';
import type { Page } from 'fixtures';
import { SplashRHS } from './RHS';

/**
 * Splash page (Hybrid)
 */
export default class Splash {
    readonly rhs: SplashRHS;

    readonly signInBtn: Locator;
    readonly signUpLink: Locator;
    readonly inputEmailField: Locator;
    readonly continueBtn: Locator;

    constructor(readonly page: Page) {
        this.rhs = new SplashRHS(page.locator('.RightContentSlot'));

        this.signInBtn = this.page.locator('[data-an-la="samsung account"]');
        this.signUpLink = this.page.locator('[data-an-la="sign up"]:visible');
        this.inputEmailField = this.page.locator('input[type="email"]');
        this.continueBtn = this.page.locator('[data-an-la="guest"]:visible');
    }

    get url() {
        return this.page.context().splashURL;
    }
}
