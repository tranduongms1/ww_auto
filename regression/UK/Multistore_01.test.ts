import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Able to add multiple product to cart page in EPP after login in Estore';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_employee' });
test.use({ account: account.any.eppRegistered('uk_employee') });
test.use({ product: product.any.hasBC.canBuy });

test(title, { tag }, async ({ context, page, home, sso, bc, cart }) => {
    const account = context.account!;
    const product = context.product!;

    context.siteUid = '';
    await page.goto(home.url);
    await home.gnb.humanIcon.click();
    await home.gnb.loginLink.click();
    await expect(page).navigatedTo(sso.loginURL);
    await sso.signInByEmail(account.email, account.password);
    await expect(page).navigatedTo(context.homeURL);

    context.siteUid = 'uk_employee';
    await page.goto(context.pointingURL);

    bc.product = product;
    await page.goto(product.bcURL!);

    await bc.waitForAddToCartButton();
    await bc.continueToCart();

    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).toContainSKU(product.sku);
});
