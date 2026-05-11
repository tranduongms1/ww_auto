import type { Locator, Page } from 'playwright';

/**
 * Global Navigation Bar (both AEM and Hybrid)
 */
export default class GNB {
    readonly section: Locator;

    readonly humanIcon: Locator;
    readonly loginLink: Locator;
    readonly userLoggedInIcon: Locator;
    readonly logoutLink: Locator;

    constructor(private page: Page) {
        this.section = page.locator(`
            nav[aria-label="main navigation"]:visible,
            app-header-global:visible
        `).last();

        this.humanIcon = this.section.locator(page.locator(`
            .before-login:visible > button:visible,
            .before-login:visible > a:visible,
            .before-login-context:visible > a:visible,
            .after-login:visible > button:visible,
            .after-login:visible > a:visible,
            .after-login-context:visible > a:visible,
            button:has([svgicon="user-bold"]):visible
        `)).last();

        this.loginLink = this.section.locator(this.page.locator(`
            [an-la="sign in sign up"]:visible,
            [an-ca="account"][an-la="login"]:visible,
            [data-an-tr="gnb-account"][data-an-la="login"]:visible    
        `).last()).or(this.page.locator('.sso-url.login-signup:visible').first());

        this.userLoggedInIcon = this.section.locator(`
            button:has(.js-gnb-afterlogin-no-image):visible,
            a:has(.js-gnb-afterlogin-no-image):visible,
            .loggedInUser:visible,
            [data-login-status="logged in"] [data-an-la="login"],
            [data-login-status="logged in"]
        `).first();
        this.logoutLink = this.page.locator('[data-an-la="logout"]:visible, [an-la="logout"]:visible').last();
    }
}
