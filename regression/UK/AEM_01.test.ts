import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'AEM Estore - Wishlist function';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ account: account.any });
test.use({ product: product.any.hasBC.canBuy });
test.use({ product2: product.any.hasPD.canBuy });

test(title, { tag }, async ({ context, page, bc, pd }) => {
    const product = context.product!;
    const product2 = context.product2!;

    bc.product = product;
    await page.goto(context.product.bcURL!);

    await bc.waitForAddToCartButton();

    await bc.continueToCart();

    pd.product = product2;
    await page.goto(context.product2.pdURL!);

    await pd.waitForAddToCartButton();

    await pd.continueToCart();
});
