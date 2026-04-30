import { test, expect } from 'fixtures';
import product from 'product';

const title = 'PF/PD/BC-Hybris integration';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasBC.outOfStock });
test.use({ product2: product.any.hasPD.outOfStock });
test.use({ product3: product.any.hasPF.outOfStock });

test(title, { tag }, async ({ context, page }) => {
    const product = context.product!;
    const product2 = context.product2!;
    const product3 = context.product3!;

    await page.goto(product.bcURL!);

    await page.goto(product2.pdURL!);

    await page.goto(product3.pfURL!);
});
