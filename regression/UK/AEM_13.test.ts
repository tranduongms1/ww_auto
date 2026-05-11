import { test, expect } from 'fixtures';
import product from 'product';

const title = 'PF/PD/BC-Hybris integration';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasBC.outOfStock });
test.use({ product2: product.any.hasPD.outOfStock });

test(title, { tag }, async ({ context, page }) => {
    const product = context.product!;
    const product2 = context.product2!;
    const pfURL = 'https://p6-pre-qa2.samsung.com/uk/dishwashers/all-dishwashers/';

    await page.goto(product.bcURL!);

    await page.goto(product2.pdURL!);
});
