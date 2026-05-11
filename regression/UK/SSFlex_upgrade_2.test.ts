import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Validate add Samsung Flex upgrade when cart already has product';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.tradeIn.scp.canBuy });
test.use({ product2: product.any.flexUpgrade.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await page.goto(cart.url);
    await cart.addToCart(product);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
});
