import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify Contact details for Registered user has saved shipping & billing address';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.any.hasAddresses });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart, checkout }) => {
    const account = context.account!;
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    await cart.continueToCheckout();
    await expect(page).navigatedTo(context.checkoutURL);
    await checkout.waitForLoad();
});
