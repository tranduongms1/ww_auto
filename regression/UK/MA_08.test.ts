import { test, expect } from 'fixtures';
import order from 'order';

const title = 'My orders > Verify OTP email is sent for the setup limit time';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ order: order.any.accountCanReadEmail });

test(title, { tag }, async ({ context, page, home }) => {
    await page.goto(home.url);
});
