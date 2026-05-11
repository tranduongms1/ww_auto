import { expect, test } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify user is able to Log in from Splash page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ account: account.any });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart, sso, checkout, capture, errors }) => {
    const product = context.product!;
    const { email, password } = context.account!;

    // 1. Navigate to MY store
    await page.goto(context.homeURL);

    // 2. Add a product to cart page
    await page.goto(cart.url);
    await cart.waitForLoad();
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
    await capture('Cart Page', cart.main);

    // 3. Click 'Continue to checkout' CTA and validate that user should be directed to splash page
    await cart.rhs.checkoutBtn.click();
    await expect(page).navigatedTo(context.splashURL);

    // 4. In splash page, click 'Checkout with Samsung account' CTA and validate that user should be redirected to login page
    await page.getByRole('link', { name: 'Checkout with Samsung account' }).click();
    await expect(page).navigatedTo(sso.loginURL);

    // 5. Enter valid email address and click 'Next' CTA
    await sso.accountInput.fill(email);
    await capture('Enter Email');
    await sso.nextBtn.click();

    // 6. Enter valid password and click 'Login' CTA
    await sso.passwordInput.fill(password);
    await capture('Enter Password');
    await sso.signInBtn.click();

    // 7. Verify user is able to Log in from Splash page and directed to checkout page
    await expect(page).navigatedTo(context.checkoutURL);
    await checkout.waitForLoad();
    await capture('Checkout Page');
});
