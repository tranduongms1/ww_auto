import { test, expect } from 'fixtures';
import order from 'order';

const title = 'Verify standalone T/I order in My orders page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ order: order.standaloneTradeIn });

test(title, { tag }, async ({ context, page, cart }) => {
    await page.goto(context.myOrdersURL);
});
