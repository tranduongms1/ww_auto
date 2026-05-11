import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify Rewards Conversion Banner on Payment Page for Non-Rewards user (GUEST user or SA user)';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasBC.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
});
