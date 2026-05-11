import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Trade-UP & EW from PD page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPD.tradeUp.warranty.canBuy });

test(title, { tag }, async ({ context, page, pd, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to CE PD page and verify Trade-up/ EW component is displayed
    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForTradeUpSection();
    await pd.waitForWarrantySection();

    // 2. Add Trade-up/ EW to a main product from PD page
    await test.step('Add Trade-up', async () => {
        await pd.tradeUpYesOpt.click();
        await pd.tradeUp.modal.waitFor();
        await page.waitForTimeout(2000);
        await pd.tradeUp.modelMenu.click();
        await pd.tradeUp.model(1).click();
        await pd.tradeUp.brandMenu.click();
        await pd.tradeUp.brand(1).click();
        await pd.tradeUp.button('Continue').click();
        await pd.tradeUp.acceptTermsAndConditions();
        await pd.tradeUp.button('Add discount').click();
        await pd.tradeUp.modal.waitFor({ state: 'hidden' });
    }).catch(() => { throw errors['pd.tradeUp.add.error'] });
    await test.step('Add EW', async () => {
        await pd.warrantyYesOpt.click();
        await pd.warranty.modal.waitFor();
        await pd.warranty.button('Continue').click();
        await pd.warranty.acceptTermsAndConditions();
        await pd.warranty.button('Add warranty').click();
        await pd.warranty.modal.waitFor({ state: 'hidden' });
    }).catch(() => { throw errors['pd.warranty.add.error'] });

    // 3. Add main product to Cart page
    await pd.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart Page', cart.main);
});
