import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = `Validate Customer access Login VIP Membership page with SSO hasn't register SMB yet`;
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business_vipmembership' });
test.use({ account: account.any.notEppRegistered('uk_business_vipmembership') });
test.use({ product: product.vip.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;

    await page.goto(context.homeURL);

    await page.goto(context.myPageURL);
});
