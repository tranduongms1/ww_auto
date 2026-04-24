import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Trade-up from PD page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasPD.tradeUp.canBuy });

test(title, { tag }, async ({ context, page, pd }) => {
    const product = context.product!;

    pd.product = product;
    await page.goto(product.pdURL!);

    await pd.waitForAddToCartButton();
    // await pd.waitForTradeUpSection();

    await pd.continueToCart();
});
