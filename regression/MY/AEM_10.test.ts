import { expect, test } from 'fixtures';
import product from 'product';
import { randomIMEI } from 'imei';

const title = 'AEM Estore - Add Trade-in from PD page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPD.tradeIn.canBuy });

test(title, { tag }, async ({ context, page, pd, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to IM PD page and verify Trade-in is displayed
    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForTradeInSection();

    // 2. Click 'Yes, please' button and Verify trade-in popup
    await pd.tradeInYesOpt.click();
    await pd.tradeIn.modal.waitFor({ timeout: 15000 });
    await pd.tradeIn.category('Smartphone').click();
    await pd.tradeIn.brand('Apple').click();
    await pd.tradeIn.model('iPhone 12').click();
    await pd.tradeIn.storages.first().click();
    await pd.tradeIn.button('Continue').click();
    await pd.tradeIn.title.filter({ hasText: 'Condition' }).waitFor();
    await pd.tradeIn.deviceConditions.first().waitFor();
    for (const condition of await pd.tradeIn.deviceConditions.all()) {
        await condition.getByText('YES', { exact: true }).click();
    }
    await pd.tradeIn.button('Continue').click();
    const imei = await randomIMEI(context, 'Apple', 'IPHONE 12');
    await pd.tradeIn.imeiInput.fill(imei);
    await pd.tradeIn.acceptTermsAndConditions();
    await pd.tradeIn.button('Apply Trade-in').click();
    await expect(pd.tradeIn.modal).toBeHidden();

    // 3. Verify able to add Trade-in to product in PD page
    await expect(pd.page.getByText('Congratulations, your trade-in request is successful.')).toBeVisible();
    await capture('PD Page After Add Trade-in', pd.tradeInSection);

    // 4. Click 'Continue' button and Add Trade-in from PD page to Cart page
    await pd.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart Page', cart.main);

    // 5. Remove Trade-in then verify Trade-in service line not display

    await capture('Cart Page After Remove Trade-in', cart.main);

    // 6. Back to PD page, Add Trade-in again in PD page to cart. Verify error message
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForTradeInSection();
    await test.step('Add Trade-in again', async () => {
        await pd.tradeInYesOpt.click();
        await expect(pd.tradeIn.modal).toBeVisible();
        await pd.tradeIn.process();
    }).catch(() => { throw errors['pd.tradeIn.add.again.error'] });
});
