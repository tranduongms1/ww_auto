import { test, expect } from 'fixtures';
import account from 'account';

const title = 'Verify able to place Standalone T/I order in T/I Marketing page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.any.canReadEmail });

test(title, { tag }, async ({ context, page, cart }) => {
    await page.goto(context.homeURL + '/trade-in/');
});
