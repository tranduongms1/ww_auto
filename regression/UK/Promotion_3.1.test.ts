import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Set up Fixed discount on products in BO';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page }) => {
    const product = context.product!;
});
