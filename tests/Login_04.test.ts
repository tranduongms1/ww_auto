import { test, expect } from 'fixtures';
import account from 'account';

const title = 'Login from cart empty page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.any });

test(title, { tag }, async ({ context, page, sso, cart }) => {
    await page.goto(context.cartURL());

    await cart.empty.section.waitFor();
    await expect.soft(cart.empty.icon, 'Empty cart icon is not visible').toBeVisible();
    await expect.soft(cart.empty.headline, 'Empty cart headline is not display correctly').toHaveText('Your basket is empty');
    await expect.soft(cart.empty.subtitle, 'Empty cart subtitle is not display correctly').toHaveText('Sign in to your Samsung account to view your saved items or continue shopping');

    await expect.soft(cart.empty.continueShoppingBtn, 'Continue shopping button is not display correctly').toHaveText('Continue shopping');
    await expect.soft(cart.empty.continueShoppingBtn, 'Continue shopping button is not enabled').toBeEnabled();

    await expect.soft(cart.empty.signInBtn, 'Sign in button is not display correctly').toHaveText('Sign in');
    await expect.soft(cart.empty.signInBtn, 'Sign in button is not enabled').toBeEnabled();

    await page.waitForTimeout(3000);
    await cart.empty.signInBtn.click();
    await expect(page, 'Not navigated to SSO login after clicking empty cart "Sign in" button').navigatedTo(sso.loginURL);

    const account = context.account!;
    await sso.signInByEmail(account.email, account.password);

    await expect(page, 'Not navigated back to cart page after login').navigatedTo(cart.url);
});
