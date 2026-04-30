import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Verify Checkout flow backwards and forward for Golden Flow from Wishlist';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.any });
test.use({ product: product.any.IM.canBuy });
test.use({ product2: product.any.CE.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product = context.product!;
    const product2 = context.product2!;
});
