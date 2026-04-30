import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify NOT able to apply more voucher code after adding vouchers from promo code pop-up and The limitation voucher has been reached';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product = context.product!;

    await page.goto(cart.url);
    await cart.waitForLoad();
    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
