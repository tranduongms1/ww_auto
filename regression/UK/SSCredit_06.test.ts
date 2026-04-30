import { test, expect } from 'fixtures';
import account from 'account';

const title = 'Verify My page - My Credit Page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.hasCredit });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;

    await page.goto('https://hshopfront.samsung.com/uk/')
});
