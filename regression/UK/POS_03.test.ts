import { test, expect } from 'fixtures';
import product from 'product';

const title = 'KX/SF/HD: Enter SERIAL and IMEI in Cart';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_o2o_kx' });
test.use({ product: product.any.IM.canBuy });

test.describe(title, { tag }, () => {
    test.use({ product: product.any.canBuy });

    test('KX', async ({ context, page, cart }) => {
        const product = context.product!;

        await page.goto(cart.url);
    });
});
