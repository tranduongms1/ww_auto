import { test, expect } from 'fixtures';

const title = 'Verify Applying discount by entering discount code in Voucher component - Cart&Checkout';
const tag = ['@Core'];

test.use({ site: 'UK' });

test(title, { tag }, async ({ context, page }) => {
    await page.goto(context.homeURL);
    
    await page.goto(context.myPageURL);
});
