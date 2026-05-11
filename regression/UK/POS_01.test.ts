import { test, expect } from 'fixtures';
import product from 'product';

const title = 'POS EA - Add product from PF/PD/BC to cart';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_o2o_kx' });

test.describe(title, { tag }, () => {
    test.use({ product: product.any.hasPF.canBuy });

    test('PF page', async ({ context, page, cart }) => {
        const product = context.product!;

        await page.goto(product.pfURL!);
    });
});

test.describe(title, { tag }, () => {
    test.use({ product: product.any.hasPD.canBuy });

    test('PD page', async ({ context, page, cart }) => {
        const product = context.product!;

        await page.goto(product.pfURL!);
    });
});

test.describe(title, { tag }, () => {
    test.use({ product: product.any.hasBC.canBuy });

    test('BC page', async ({ context, page, cart }) => {
        const product = context.product!;

        await page.goto(product.pfURL!);
    });
});
