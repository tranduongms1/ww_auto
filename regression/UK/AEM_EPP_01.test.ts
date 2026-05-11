import { test, expect } from 'fixtures';
import account from 'account';

const title = 'Logout Journey';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_employee' });
test.use({ account: account.any.eppRegistered('uk_employee') });

test(title, { tag }, async ({ context, page, sso, home }) => {
    await page.goto(home.url);

    const signInBtn = page.getByRole('button', { name: 'Sign in with Samsung' });
    await expect.soft(signInBtn, 'Sign in with Samsung button is not visible').toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);

    await signInBtn.click();
    await expect(page).navigatedTo(sso.loginURL);
    const account = context.account!;
    await sso.signInByEmail(account.email, account.password);
    await expect(page).navigatedTo(context.shopURL);

    await page.goto(home.url);

    await home.gnb.humanIcon.hover();
    await home.gnb.logoutLink.click();
    await home.gnb.humanIcon.waitFor({ state: 'hidden' });

    await expect(page, 'Not redirected to multistore auth page after logout').navigatedTo(context.shopURL + '/auth/multistore');
});
