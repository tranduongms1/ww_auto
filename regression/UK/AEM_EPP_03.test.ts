import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';
import { login } from './epp';

const title = 'Add products from PD page';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_employee' });
test.use({ account: account.any.eppRegistered('uk_employee') });
test.use({ product: product.any.hasPD.canBuy });

test(title, { tag }, async ({ context, page, pd }) => {
    const product = context.product!;

    await login(page);

    pd.product = product;
    await page.goto(context.product.pdURL!);

    await pd.waitForAddToCartButton();

    await pd.continueToCart();
});
