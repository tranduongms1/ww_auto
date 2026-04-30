import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'AC9: Validate static message in Order confirmation page';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any.noOrders });
test.use({ product: product.reservation.canBuy });

test(title, { tag }, async ({ context, page, cart, sso }) => {
    const account = context.account!;
    const product = context.product!;

    await page.goto(context.cartURL);
    await cart.empty.signInBtn.click();
    await expect(page).navigatedTo(sso.loginURL);
    await sso.signInByEmail(account.email, account.password);
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);

    await cart.continueToCheckout();
});
