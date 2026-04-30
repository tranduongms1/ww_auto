import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Able to add multiple product to cart page in SMB after login in Estore';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business' });
test.use({ account: account.any.eppRegistered('uk_business') });
test.use({ product: product.any.hasBC.canBuy });

test(title, { tag }, async ({ context, page, bc, cart }) => {
    const product = context.product!;

    context.siteUid = '';
    await page.goto(context.cartURL);

    context.siteUid = 'uk_business';
    bc.product = product;
    await page.goto(product.bcURL!);

    await bc.waitForAddToCartButton();
    await bc.continueToCart();

    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).toContainSKU(product.sku);
});
