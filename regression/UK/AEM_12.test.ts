import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add-on page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasBC.hasAddOn.canBuy });

test(title, { tag }, async ({ context, page, bc }) => {
    const product = context.product!;

    bc.product = product;
    await page.goto(product.bcURL!);

    await bc.waitForAddToCartButton();

    await bc.addToCartBtn.click();
});
