import { test, expect } from 'fixtures';

const title = 'My orders > Verify not able to search for order with valid data but Invalid OTP';
const tag = ['@Core'];

test.use({ site: 'UK' });

test(title, { tag }, async ({ context, page, home }) => {
    await page.goto(home.url);
});
