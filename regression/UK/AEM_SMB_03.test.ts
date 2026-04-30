import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';
import { login } from './epp';

const title = 'Verify able to add and mix KM with Trade-in & SCB on the cart page';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business' });
test.use({ account: account.any.eppRegistered('uk_business') });
test.use({ product: product.any.knox.tradeIn.canBuy });
test.use({ product: product.any.knox.tradeIn.canBuy.nth(2) });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await login(page);

    await page.goto(cart.url);

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);

    await cart.addToCart(product2);
    await expect(cart).toContainSKU(product2.sku);
});
