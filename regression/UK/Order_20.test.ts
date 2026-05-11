import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Unable to use the same IMEI for 2 orders';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.tradeIn.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    await cart.continueToCheckout();
});
