import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify the Reward information for Completed order';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any });
test.use({ product: product.any.IM.preOrder.tradeIn.canBuy });
test.use({ product: product.any.CE.tradeUp.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product1 = context.product!;
    const product2 = context.product2!;

    await page.goto(context.cartURL());

    await cart.addToCart(product1);
    await expect(cart).toContainSKU(product1.sku);

    await cart.addToCart(product2);
    await expect(cart).toContainSKU(product2.sku);
});
