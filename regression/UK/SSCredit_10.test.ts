import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify SS Credits on payment page with Guest user or Non SS credit member';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(cart.url);
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
    await cart.continueToCheckout();
    await expect(page).navigatedTo(context.checkoutURL);
});
