import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify Contact details for Guest User';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL());

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
