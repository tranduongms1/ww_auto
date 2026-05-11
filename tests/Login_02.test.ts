import { expect, test } from 'fixtures';
import account from 'account';

const title = 'Verify able to login by SSO account from AEM GNB';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ account: account.any });

test(title, { tag }, async ({ context, page, sso, home, capture, errors }) => {
    const { email, password } = context.account!;

    // 1. Access to MY AEM home page
    await page.goto(home.url);
    await home.gnb.humanIcon.hover();
    await capture('Before Login', home.gnb.section);

    // 2. Hover mouse to Human icon on GNB, Click sign-in on GNB
    await home.gnb.humanIcon.hover();
    await home.gnb.loginLink.click();
    await expect(page).navigatedTo(sso.loginURL);

    // 3. Enter valid credentials to login
    await sso.accountInput.waitFor();
    await sso.accountInput.fill(email);
    await sso.autoZoom();
    await capture('Account Input');
    await sso.nextBtn.click();
    await sso.passwordInput.fill(password);
    await sso.autoZoom();
    await capture('Password Input');
    await sso.signInBtn.click();
    await sso.afterSignInProcess();

    // 4. Verify able to login by SSO account from AEM GNB
    await expect(page).navigatedTo(context.homeURL);
    await home.gnb.humanIcon.waitFor();
    await page.waitForTimeout(3000);
    await capture('Home After Login');
    await home.gnb.humanIcon.hover();
    await page.waitForTimeout(3000);
    await capture('Home User Menu');

    // 5. Hover mouse over the Human icon, then click on Log out
    await home.gnb.humanIcon.hover();
    await home.gnb.logoutLink.click();
    await home.gnb.logoutLink.waitFor({ state: 'hidden' });
    await page.waitForTimeout(5000);
    await home.gnb.humanIcon.hover();
    await expect(home.gnb.loginLink).toBeVisible();
    await expect(home.gnb.logoutLink).toBeHidden();
    await capture('After Log out');
});
