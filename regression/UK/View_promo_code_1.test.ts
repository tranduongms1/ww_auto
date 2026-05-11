import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify View promotion codes button is displayed in RHS summary in cart page with Register';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product = context.product!;

    await page.goto(cart.url);
    await cart.waitForLoad();
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    await cart.continueToCheckout();
    await expect(page).navigatedTo(context.checkoutURL);
});
