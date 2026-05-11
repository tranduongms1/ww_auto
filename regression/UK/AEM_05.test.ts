import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add SC+/Trade-in from PD page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasPD.tradeIn.scp.canBuy });

test(title, { tag }, async ({ context, page, pd }) => {
    const product = context.product!;

    pd.product = product;
    await page.goto(product.pdURL!);

    await pd.waitForAddToCartButton();
    await pd.waitForTradeInSection();
    await pd.waitForSCPSection();

    await pd.continueToCart();
});
