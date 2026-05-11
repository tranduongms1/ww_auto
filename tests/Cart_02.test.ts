import { expect, test } from 'fixtures';

const title = 'Verify Empty Cart for Registered User';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ asRegistered: true });

test(title, { tag }, async ({ context, page, home, sso, cart, capture, errors }) => {
    // 1. Access to MY storefront as Registered user
    await page.goto(context.homeURL);

    // 2. Navigate to cart page
    await page.goto(context.cartURL);
    await cart.clearCart();
    await cart.empty.section.waitFor();

    // 3. Verify the Empty status in cart page
    // - Empty Cart Icon
    // - Headline text
    // - Sub text
    // - CTA:
    // - Continue Shoping
    await expect.soft(cart.empty.icon, 'Empty cart icon is not visible').toBeVisible();
    await expect.soft(cart.empty.headline, 'Empty cart headline is not display correctly').toHaveText('Your cart is empty');
    await expect.soft(cart.empty.subtitle, 'Empty cart subtitle is not display correctly').toHaveText('Sign in to your Samsung account to view your saved items or continue shopping');
    await expect.soft(cart.empty.continueShoppingBtn, 'Continue shopping button is not visible').toBeVisible();
    if (await cart.empty.continueShoppingBtn.isVisible()) {
        await expect.soft(cart.empty.continueShoppingBtn, 'Continue shopping button is not display correctly').toHaveText('Continue shopping');
        await expect.soft(cart.empty.continueShoppingBtn, 'Continue shopping button is not enabled').toBeEnabled();
    }
    await expect.soft(cart.empty.signInBtn, 'Sign in button should be hidden').toBeHidden();
    await capture('Cart Empty Page');

    // 4. Click "Continue Shopping" CTA
    if (await cart.empty.continueShoppingBtn.isVisible()) {
        await cart.empty.continueShoppingBtn.click();
        await expect(page).navigatedTo(context.homeURL);
        await capture('Home Page');
    }
});
