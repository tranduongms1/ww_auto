import { expect, test } from 'fixtures';
import order from 'order';

const title = 'Verify My orders - Verify not able to search for order with valid data but Invalid email/order ID as Guest user';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ order: order.any.accountCanReadEmail });

test(title, { tag }, async ({ context, page, myOrders, capture, errors }) => {
    const { number: orderNumber, account: { email } } = context.order!;

    // 1. Go to order tracking page (Guest User)
    await page.goto(context.myOrdersURL);

    // 2. Leave blank Order ID, email ID

    // 3. Input Valid order ID and invalid email ID format > Clicks "Send Code" button. Verify

    // 4. Input invalid Order ID and invalid email > Clicks "Send Code" button. Verify

    // 5. Input Invalid Order ID and Valid email > Clicks "Send Code" button. Verify
});
