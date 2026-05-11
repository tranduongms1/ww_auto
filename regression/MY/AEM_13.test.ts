import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Trade-up from PD page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPD.tradeUp.canBuy });

test(title, { tag }, async ({ context, page, pd, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to CE PD page and verify Trade-up is displayed
    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForTradeUpSection();

    // 2. Click Trade-up option and Verify Trade-up pop-up
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

    // 3. Verify able to add Trade-up to product in PD page
    await capture('PD Page After Add Trade-up', pd.tradeUpSection);

    // 4. Click 'Continue' button and Add Trade-up from PD page to Cart page
    await pd.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart Page', cart.main);

    // 5. Remove Trade-up then verify Trade-up service line not display

    await capture('Cart Page After Remove Trade-up', cart.main);

    // 6. Back to PD page, Add Trade-up again in PD page to cart. Verify error message
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForTradeUpSection();
    await test.step('Add Trade-up again', async () => {
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
    }).catch(() => { throw errors['pd.tradeUp.add.again.error'] });
    const errorPopup = page.locator('.confirm-popup');
    await expect(errorPopup, '[Error Popup] Error popup not displayed after adding Trade-up again').toBeVisible();
    await expect.soft(errorPopup.locator('.confirm-popup__desc'), '[Error Popup] Error message not displayed as expected').toHaveText(
        'Trade up service is only available for one product per order. If you wish to proceed to add other products to your order, please ensure they do not have the trade up service.'
    );
    await expect.soft(errorPopup.locator('.cta[an-la="error popup:close"]'), '[Error Popup] Close button not displayed as expected').toBeVisible();
    await capture('Error popup', errorPopup);
    await errorPopup.locator('.cta[an-la="error popup:close"]').click();
    await expect(errorPopup, '[Error Popup] popup not closed after clicking Close button').toBeHidden();
});
