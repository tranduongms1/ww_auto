import { test, expect } from 'fixtures';
import account from 'account';

const title = 'My account - Order Listing';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.any.hasOrders });

test(title, { tag }, async ({ context, page, home }) => {
    await page.goto(home.url);
});
