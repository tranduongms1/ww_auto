import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Validate adding Galaxy Club only from AEM to cart';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasBC.galaxyClub.canBuy });

test(title, { tag }, async ({ context, page, bc }) => {
    const product = context.product!;

    bc.product = product;
    await page.goto(product.bcURL!);

    await bc.waitForAddToCartButton();
    await bc.waitForGalaxyClubSection();

    await bc.continueToCart();
});
