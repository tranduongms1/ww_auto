import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify the Reward information for Completed order';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_o2o_kx' });
test.use({ account: account.reward.rewardLevel('Blue').canReadEmail });
test.use({ product: product.any.IM.preOrder.tradeIn.canBuy });
test.use({ product2: product.any.CE.tradeUp.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product1 = context.product!;
    const product2 = context.product2!;

    await page.goto(context.cartURL);

    await cart.addToCart(product1);
    await expect(cart).containSKU(product1.sku);

    await cart.addToCart(product2);
    await expect(cart).containSKU(product2.sku);
});
