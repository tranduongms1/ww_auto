import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Customer screen_Verify customer able to login after scanning QR code';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
