import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Ring from BC page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.Ring.hasBC.canBuy });

test(title, { tag }, async ({ context, page, bc, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to MY AEM page
    // 2. Access Ring BC page
    bc.product = product;
    await page.goto(product.bcURL!);
    await bc.waitForAddToCartButton();

    // 3. In Ring BC page, select any color
    await bc.ringColor(product.ringColor!).click();

    // 4. Click 'Buy now' button and validate user is directed to cart page
    await bc.addToCartBtn.click();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();

    // 6. Verify user able to add Placeholder Ring SKU + Sizing Kit to cart page
    await expect(cart).containSKU(product.sku);
    await expect(cart).containSKU(product.sizingKitSKU);
    await capture('Cart Page', cart.main);

    // 7. Back to Ring BC page
    await page.goto(product.bcURL!);
    await bc.waitForAddToCartButton();

    // 8. Select the same color for Ring product
    await bc.ringColor(product.ringColor!).click();

    // 9. Click 'Buy now' button and validate user is directed to cart page
    await bc.addToCartBtn.click();
    await expect(page).not.navigatedTo(context.cartURL);
    await cart.waitForLoad();

    // 10. Verify user unable to add Placeholder Ring SKU same color to the cart page
});
