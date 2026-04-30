import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify The button (Cancel Subscription, delay subscription & change frequency) display on my order page';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.daSub.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
