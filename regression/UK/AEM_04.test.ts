import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add products from PD page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasPD.canBuy });

test(title, { tag }, async ({ context, page, pd }) => {
    const product = context.product!;

    pd.product = product;
    await page.goto(context.product.pdURL!);

    await pd.waitForAddToCartButton();

    await pd.continueToCart();
});
