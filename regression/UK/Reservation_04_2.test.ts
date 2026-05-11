import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Validate customer can purchase multiple reservation product as SEPARATE orders';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any.noOrders });
test.use({ product: product.reservation.canBuy });
test.use({ product2: product.reservation.canBuy.nth(2) });

test(title, { tag }, async ({ context, page, cart, sso }) => {
    const account = context.account!;
    const product = context.product!;
    const product2 = context.product2!;

    await page.goto(context.cartURL);
    await cart.empty.signInBtn.click();
    await expect(page).navigatedTo(sso.loginURL);
    await sso.signInByEmail(account.email, account.password);
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
    await cart.continueToCheckout();
});
