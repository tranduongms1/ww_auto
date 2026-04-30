import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Display Product Warehouse Location and Quantity in Cart';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_o2o_kx' });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(cart.url);
});
