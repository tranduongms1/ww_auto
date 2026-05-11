import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Update payment details - Tokenisation payment - Guest user';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasBC.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
});
