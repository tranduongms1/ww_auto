import { test, expect } from 'fixtures';
import account from 'account';

const title = 'My account - Vouchers';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any });

test(title, { tag }, async ({ context, page, home }) => {
    await page.goto(home.url);
});
