import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify One of Delivery services is displayed in checkout page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.sku('SM-F721BLVGEUB') });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
});
