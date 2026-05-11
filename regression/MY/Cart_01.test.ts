import { expect, test } from 'fixtures';

const title = 'Verify Empty Cart for Guest';
const tag = ['@Core'];

test.use({ site: 'MY' });

test(title, { tag }, async ({ context, page, cart, sso, capture, errors }) => {
    // 1. Access to MY storefront as Guest user
    await page.goto(context.homeURL);

    // 2. Navigate to cart page
    await page.goto(context.cartURL);
    await cart.empty.section.waitFor();

    // 3. Verify the Empty status in cart page
    // - Empty Cart Icon
    // - Headline text
    // - Sub text
    // - CTA:
    // - Continue Shoping
    // - Sign In
    await expect.soft(cart.empty.icon, 'Empty cart icon is not visible').toBeVisible();
    await expect.soft(cart.empty.headline, 'Empty cart headline is not display correctly').toHaveText('Your cart is empty');
    await expect.soft(cart.empty.subtitle, 'Empty cart subtitle is not display correctly').toHaveText('Sign in to your Samsung account to view your saved items or continue shopping');
    await expect.soft(cart.empty.continueShoppingBtn, 'Continue shopping button is not visible').toBeVisible();
    if (await cart.empty.continueShoppingBtn.isVisible()) {
        await expect.soft(cart.empty.continueShoppingBtn, 'Continue shopping button is not display correctly').toHaveText('Continue shopping');
        await expect.soft(cart.empty.continueShoppingBtn, 'Continue shopping button is not enabled').toBeEnabled();
    }
    if (await cart.empty.signInBtn.isVisible()) {
        await expect.soft(cart.empty.signInBtn, 'Sign in button is not display correctly').toHaveText('Sign in');
        await expect.soft(cart.empty.signInBtn, 'Sign in button is not enabled').toBeEnabled();
    }
    await capture('Cart Empty Page');

    // 4. Click "Continue Shopping" CTA
    if (await cart.empty.continueShoppingBtn.isVisible()) {
        await cart.empty.continueShoppingBtn.click();
        await expect(page).navigatedTo(context.homeURL);
        await capture('Home Page');
    }

    // 5. Back to cart page
    await page.goto(context.cartURL);
    await cart.empty.section.waitFor();

    // 6. Click "Sign-in" CTA
    if (await cart.empty.signInBtn.isVisible()) {
        await cart.empty.signInBtn.click();
        await expect(page).navigatedTo(sso.loginURL);
        await sso.accountInput.waitFor();
        await capture('SSO Login Page');
    }
});
