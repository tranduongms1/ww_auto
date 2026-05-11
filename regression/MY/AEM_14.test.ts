import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add EW from PD page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPD.warranty.canBuy });

test(title, { tag }, async ({ context, page, pd, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to CE/DA PD page and verify EW is displayed
    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForWarrantySection();

    // 2. Click 'Yes' button and Verify EW pop-up
    await pd.warrantyYesOpt.click();
    await pd.warranty.modal.waitFor();
    await pd.warranty.button('Continue').click();
    await pd.warranty.acceptTermsAndConditions();
    await pd.warranty.button('Add warranty').click();
    await pd.warranty.modal.waitFor({ state: 'hidden' });

    // 3. Verify able to add EW to product in PD page 
    await expect(pd.page.getByText('Congratulations, your warranty request is successful.')).toBeVisible();
    await capture('PD Page After Add EW', pd.warrantySection);

    // 4. Click 'Continue' button and Add EW from PD page to Cart page
    await pd.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart Page', cart.main);

    // 5. Remove EW then verify EW service line not display
    await capture('Cart Page After Remove EW', cart.main);
});
