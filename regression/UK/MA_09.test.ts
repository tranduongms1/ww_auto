import { test, expect } from 'fixtures';

const title = 'My orders > Verify cannot send email after OTP Expiry or updating email within OTP Expiry';
const tag = ['@Core'];

test.use({ site: 'UK' });

test(title, { tag }, async ({ context, page, home }) => {
    await page.goto(home.url);
});
