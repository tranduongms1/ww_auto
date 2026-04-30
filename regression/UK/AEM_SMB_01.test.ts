import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';
import { login } from './epp';

const title = 'Add products from PF page and VAT function';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business' });
test.use({ account: account.any.eppRegistered('uk_business') });
test.use({ product: product.any.hasPF.hasPD.canBuy });

test(title, { tag }, async ({ context, page, pf }) => {
    const product = context.product!;

    await login(page);

    await page.goto(product.pfURL!);
});
