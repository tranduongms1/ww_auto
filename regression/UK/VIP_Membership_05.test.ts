import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify VIP membership is able to apply VIP membership voucher codes';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business_vipmembership' });
test.use({ account: account.any.eppRegistered('uk_business_vipmembership') });
test.use({ product: product.vip.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;

    await page.goto(context.homeURL);
    
    await page.goto(context.myPageURL);
});
