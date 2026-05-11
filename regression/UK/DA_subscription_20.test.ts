import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Change Frequency of Subscription [Multiple DA Subscription in Order]';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.daSub.canBuy });
test.use({ product2: product.any.daSub.canBuy.nth(2) });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    await cart.addToCart(product2);
    await expect(cart).containSKU(product2.sku);
});
