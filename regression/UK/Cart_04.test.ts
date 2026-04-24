import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify GC options in cart page - Scenario 1';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.galaxyClub.scp.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL());

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
