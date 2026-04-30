import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Validate Samsung Flex upgrade display correctly in cart, checkout, thank you page';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.flexUpgrade.scp.canBuy });
test.use({ product2: product.any.tradeIn.scp.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await page.goto(cart.url);
    await cart.addToCart(product);
    await cart.waitForLoad();
    await expect(cart).toContainSKU(product.sku);
});
