import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify the Reward information with order Full Return';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.reward.rewardLevel('Platinum') });
test.use({ product: product.sku('SM-F721BLVGEUB') });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL);

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
