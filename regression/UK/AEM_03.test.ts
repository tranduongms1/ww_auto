import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add products from PF page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasBC.hasPF.canBuy });

test(title, { tag }, async ({ context, page, bc }) => {
    const product = context.product!;

    await page.goto(product.pfURL!);

    bc.product = product;
    await page.goto(product.bcURL!);

    await bc.waitForAddToCartButton();

    await bc.continueToCart();
});
