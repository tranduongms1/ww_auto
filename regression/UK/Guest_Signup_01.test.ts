import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify guest checkout using email that is associated with existing account';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.any.canReadEmail });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
