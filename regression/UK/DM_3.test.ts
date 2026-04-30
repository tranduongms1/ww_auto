import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify Delivery section display correctly - CE+IM products - Selecting delivery services';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.CE.canBuy });
test.use({ product2: product.any.IM.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);

    await cart.addToCart(product2);
    await expect(cart).toContainSKU(product2.sku);
});
