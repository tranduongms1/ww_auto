import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify adding/ Editing/ Removing Additional services to cart';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.tradeIn.scp.canBuy });
test.use({ product2: product.any.tradeUp.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);

    await cart.addToCart(product2);
    await expect(cart).toContainSKU(product2.sku);
});
