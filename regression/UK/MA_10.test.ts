import { test, expect } from 'fixtures';

const title = 'Bypass OTP when accessing my orders page through ASM';
const tag = ['@Core'];

test.use({ site: 'UK' });

test(title, { tag }, async ({ context, page, home }) => {
    await page.goto(home.url);
});
