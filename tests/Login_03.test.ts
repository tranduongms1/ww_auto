import { expect, test } from 'fixtures';
import account from 'account';

const title = 'Verify able to login by SSO account from empty cart';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ account: account.any });

test(title, { tag }, async ({ context, page, cart, sso, capture, errors }) => {
    const { email, password } = context.account!;

    // 1. Access to MY store as Guest user
    await page.goto(context.homeURL);

    // 2. Click Cart icon
    await page.goto(context.cartURL);
    await cart.empty.signInBtn.waitFor();
    await capture('Cart Empty Page');

    // 3. Click on "Sign In' button
    await cart.empty.signInBtn.click();
    await expect(page).navigatedTo(sso.loginURL);

    // 4. Verify able to login by SSO account from empty cart
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

    await expect(page).navigatedTo(context.cartURL);
    await cart.gnb.humanIcon.waitFor();
    await capture('Cart After Login');
    await cart.gnb.humanIcon.hover();
    await page.waitForTimeout(3000);
    await capture('Cart User Menu');

    // 5. Hover mouse over the Human icon, then click on Log out
    await cart.gnb.humanIcon.hover();
    await cart.gnb.logoutLink.click();
    await cart.gnb.logoutLink.waitFor({ state: 'hidden' });
    await page.waitForTimeout(5000);
    await cart.gnb.humanIcon.hover();
    await expect(cart.gnb.loginLink).toBeVisible();
    await expect(cart.gnb.logoutLink).toBeHidden();
    await capture('After Log out');
});
