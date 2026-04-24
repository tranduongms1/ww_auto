import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { expect, test } from 'fixtures';
import account from 'account';
import { allSites } from './sites';

const title = 'Sign-up function';
const tag = ['@Core'];

test.use({ account: account.any });

for (const site of allSites) {
    test.describe(title, { tag }, () => {
        test.use({ site });

        test(site, async ({ context, page, api, cart }, testInfo) => {
            const productsPath = path.join(__dirname, site.toUpperCase(), 'products.json');
            const data: { purchasable: string[], outOfStock: string[], products: { sku: string }[] } = require(productsPath);
            test.skip(!data.products.length);

            await page.goto(context.cartURL());
            await cart.empty.section.waitFor();
            await api.addToCart(data.products[0].sku);
            await page.reload();
            await cart.cartItemList.waitFor();
            await cart.cartItems.first().waitFor();
            await cart.rhs.section.waitFor();
            // await expect.soft(cart.rhs.summary).toBeVisible();
            // await expect.soft(cart.rhs.summaryHeading).toBeVisible();
            // await expect.soft(cart.rhs.summaryRows.first()).toBeVisible();
            // await expect.soft(cart.rhs.totalSummary.first()).toBeVisible();
            // await expect.soft(cart.rhs.totalAmount).toBeVisible();

            await expect.soft(cart.rhs.checkoutBtn).toBeVisible();
            // await expect.soft(cart.rhs.guestCheckoutBtn).toBeVisible();
            // await expect.soft(cart.rhs.expressCheckoutBtn).toBeVisible();

            // await expect.soft(cart.rhs.tieringMessage).toBeVisible();
            // await expect.soft(cart.rhs.rewardsBenefit).toBeVisible();

            // await expect.soft(cart.rhs.termsAndConditions).toBeVisible();
            // await expect.soft(cart.rhs.reasonsToBuy.first()).toBeVisible();

            await cart.continueToCheckout();
            await expect(page, 'Not navigated to splash page after clicking checkout button').navigatedTo(context.splashURL());

            // writeFileSync(productsPath, JSON.stringify(data, null, 2));
        });
    });
}
