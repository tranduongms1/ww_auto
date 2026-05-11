import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Set up Payment promotion in BO  (Paypal + Trigger rule message)';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page }) => {
    const product = context.product!;
});
