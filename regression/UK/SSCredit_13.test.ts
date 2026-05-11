import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify SS Credits on payment page when cart has added service';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.hasCredit });

test.describe(title, { tag }, () => {
    test.use({ product: product.any.scp.canBuy });

    test('SC+', async ({ context, page, cart }) => {
        const product = context.product!;

        await page.goto(cart.url);
        await cart.addToCart(product);
        await expect(cart).containSKU(product.sku);
    });
});

test.describe(title, { tag }, () => {
    test.use({ product: product.any.daSub.canBuy });

    test('DA Subscription', async ({ context, page, cart }) => {
        const product = context.product!;

        await page.goto(cart.url);
        await cart.addToCart(product);
        await expect(cart).containSKU(product.sku);
    });
});

test.describe(title, { tag }, () => {
    test.use({ product: product.any.sim.canBuy });

    test('SIM', async ({ context, page, cart }) => {
        const product = context.product!;

        await page.goto(cart.url);
        await cart.addToCart(product);
        await expect(cart).containSKU(product.sku);
    });
});
