import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';
import { login } from './epp';

const title = 'Verify able to add and mix KM with Trade-in from AEM page';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business' });
test.use({ account: account.any.eppRegistered('uk_business') });
test.use({ product: product.any.hasPD.knox.tradeIn.canBuy });
test.use({ product: product.any.hasPD.knox.tradeIn.canBuy.nth(2) });

test(title, { tag }, async ({ context, page, pd }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await login(page);

    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();

    await pd.continueToCart();

    pd.product = product2;
    await page.goto(product2.pdURL!);
    await pd.waitForAddToCartButton();

    await pd.continueToCart();
});
