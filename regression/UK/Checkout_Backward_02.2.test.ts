import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';
import { login } from './epp';

const title = 'Verify Checkout flow backwards and forward for Golden Flow from Wishlist_SMB';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business' });
test.use({ account: account.any.eppRegistered('uk_business') });
test.use({ product: product.any.IM.canBuy });
test.use({ product2: product.any.CE.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await login(page);
});
