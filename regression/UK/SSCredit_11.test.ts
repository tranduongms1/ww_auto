import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify SS Credits on payment page with SS credits member incase Redemption value < Cart total';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.hasCredit });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product = context.product!;

    await page.goto(cart.url);
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    await cart.continueToCheckout();
    await expect(page).navigatedTo(context.checkoutURL);
});
