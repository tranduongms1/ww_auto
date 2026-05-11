import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'UK_HGE-5385_1: Verify the Updated Order Confirmation page should be displayed when customer placed an order';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.any });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product = context.product!;

    await page.goto(cart.url);
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    await cart.continueToCheckout();
    await expect(page).navigatedTo(context.checkoutURL);
});
