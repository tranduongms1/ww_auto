import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';
import { login } from './epp';

const title = 'Verify Contact details for Guest User_SMB';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business' });
test.use({ account: account.any.eppRegistered('uk_business') });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart, checkout }) => {
    const product = context.product!;

    await login(page);

    await page.goto(cart.url);

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    await cart.continueToCheckout();
    await expect(page).navigatedTo(context.checkoutURL);
});
