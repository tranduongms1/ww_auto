import { expect, test } from 'fixtures';
import { allSites } from './sites';
import account from 'account';

const title = 'Test all sites';
const tag = ['@Core'];

for (const site of allSites) {
    test.describe(title, { tag }, () => {
        test.use({ site });
        test.use({ account: account.any });

        test(site, async ({ context, page, sso, cart }) => {
            await page.goto(context.homeURL);
            await page.goto(cart.url);

            await cart.empty.section.waitFor();
            await expect.soft(cart.empty.icon, 'Empty cart icon is not visible').toBeVisible();

            await expect.soft(cart.empty.signInBtn, 'Sign in button is not enabled').toBeEnabled();

            await page.waitForTimeout(3000);
            await cart.empty.signInBtn.click();
            await expect(page, 'Not navigated to SSO login after clicking empty cart "Sign in" button').navigatedTo(sso.loginURL);

            const account = context.account!;
            await sso.signInByEmail(account.email, account.password);

            await expect(page, 'Not navigated back to cart page after login').navigatedTo(cart.url);
        });
    });
}
