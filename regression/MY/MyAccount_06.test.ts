import { expect, test } from 'fixtures';
import account from 'account';

const title = `Verify My orders - Verify Order's expanded view as Registered user`;
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ asRegistered: true });
test.use({ account: account.any.hasOrders });

test(title, { tag }, async ({ context, page, myOrders, capture, errors }) => {
    // 1. Login to the MY Samsung site
    await page.goto(context.homeURL);

    // 2. Navigate to My Account page
    // 3. Navigate to My Orders page
    await page.goto(context.myOrdersURL);

    // 4. Click on View detail CTA of 1 order. Verify
    const orderItem = myOrders.orderItem(1);
    await expect(orderItem.viewDetailsBtn).toBeVisible();
    await capture('Order Item Before Click View Detail', orderItem.section);
    await orderItem.viewDetailsBtn.click();
    await expect.soft(orderItem.viewDetailsBtn).toBeHidden({ timeout: 10000 });
    await page.waitForTimeout(10000);
    await capture('Order Item After Click View Detail', orderItem.section);

    // 5. Click on "Show less"
    await expect(orderItem.showLessBtn).toBeVisible();
    await orderItem.showLessBtn.click();
    await expect.soft(orderItem.showLessBtn).toBeHidden({ timeout: 10000 });
    await page.waitForTimeout(3000);
    await capture('Order Item After Click Show Less', orderItem.section);
});
