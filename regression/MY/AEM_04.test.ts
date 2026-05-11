import { test, expect } from 'fixtures';
import product from 'product';
import { randomIMEI } from 'imei';

const title = 'AEM Estore - Add Trade-in from BC page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasBC.tradeIn.canBuy });

test(title, { tag }, async ({ context, page, bc, cart, capture }) => {
    const product = context.product!;

    // 1. Access to BC page and verify Trade-in is displayed
    bc.product = product;
    await page.goto(product.bcURL!);
    await bc.waitForAddToCartButton()
    await bc.waitForTradeInSection();

    // 2. Add Trade-in to a main product from BC page
    // 3. Click 'Yes, please' button and Verify trade-in popup
    await bc.tradeInYesOpt.click();
    await bc.tradeIn.modal.waitFor({ timeout: 15000 });
    await bc.tradeIn.category('Smartphone').click();
    await bc.tradeIn.brand('Apple').click();
    await bc.tradeIn.model('iPhone 12').click();
    await bc.tradeIn.storages.first().click();
    await bc.tradeIn.button('Continue').click();
    await bc.tradeIn.title.filter({ hasText: 'Condition' }).waitFor();
    await bc.tradeIn.deviceConditions.first().waitFor();
    for (const condition of await bc.tradeIn.deviceConditions.all()) {
        await condition.getByText('YES', { exact: true }).click();
    }
    await bc.tradeIn.button('Continue').click();
    const imei = await randomIMEI(context, 'Apple', 'IPHONE 12');
    await bc.tradeIn.imeiInput.fill(imei);
    await bc.tradeIn.acceptTermsAndConditions();
    await bc.tradeIn.button('Apply Trade-in').click();
    await expect(bc.tradeIn.modal).toBeHidden();
    await expect(bc.page.getByText('Congratulations, your trade-in request is successful.')).toBeVisible();
    await capture('BC Page After Add Trade-in', bc.tradeInSection);

    // 4. Click "Buy now" CTA and Add Trade-in from BC page to Cart page
    await bc.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart', cart.main);

    // 5. Remove add Trade-in then add it again from Cart page
    await capture('Cart After Remove Trade-in', cart.main);
});
