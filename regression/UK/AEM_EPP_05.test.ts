import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';
import { login } from './epp';

const title = 'Add SC+ from BC/PD page';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_employee' });
test.use({ account: account.any.eppRegistered('uk_employee') });

test.describe(title, { tag }, () => {
    test.use({ product: product.any.hasBC.scp.canBuy });

    test('BC page', async ({ context, page, bc }) => {
        const product = context.product!;

        await login(page);

        bc.product = product;
        await page.goto(context.product.bcURL!);

        await bc.waitForAddToCartButton();
        await bc.waitForSCPSection();

        await bc.continueToCart();
    });
});

test.describe(title, { tag }, () => {
    test.use({ product: product.any.hasPD.scp.canBuy });

    test('PD page', async ({ context, page, pd }) => {
        const product = context.product!;

        await login(page);

        pd.product = product;
        await page.goto(context.product.pdURL!);

        await pd.waitForAddToCartButton();
        await pd.waitForSCPSection();

        await pd.continueToCart();
    });
});
