import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';
import { login } from './epp';

const title = 'Add products from PF page';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_employee' });
test.use({ account: account.any.eppRegistered('uk_employee') });
test.use({ product: product.any.hasPF.canBuy });

test(title, { tag }, async ({ context, page }) => {
    await login(page);

    await page.goto(context.product.pfURL!);
});
