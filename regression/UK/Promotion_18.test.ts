import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Payment promotion';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page }) => {
    const product = context.product!;
});
