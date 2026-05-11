import { test, expect } from 'fixtures';

const title = 'My orders > Verify the system still validate the Email ID and Order ID';
const tag = ['@Core'];

test.use({ site: 'UK' });

test(title, { tag }, async ({ context, page, home }) => {
    await page.goto(home.url);
});
