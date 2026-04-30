import { test, expect } from 'fixtures';
import product from 'product';

const title = 'IMEI is released when Trade-in order is cancelled';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.tradeIn.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);

    await cart.continueToCheckout();
});
