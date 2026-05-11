import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Product in Add-on page and Gift page from PD page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPD.hasAddOn.hasGift.canBuy });

test(title, { tag }, async ({ context, page, pd, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access AEM PD page
    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();

    // 2. Select product with added service and click "Continue" > Navigate to PD Page > click "Buy now" CTA
    if (pd.isTradeInOptionSelectable()) {
        await pd.tradeInNoOpt.click();
        console.log('Trade In No option selected');
    }
    if (pd.shouldSelectSCP()) {
        await pd.scpNoneOpt.click();
        console.log('SCP None option selected');
    }
    await pd.addToCartBtn.click();

    // 3. On the Add-on page, select any product and click "Continue"
    await pd.addOn.section.waitFor();
    const addOnAddBtn = pd.addOn.addableProducts.addBtn.first();
    const addOnSKU = await addOnAddBtn.getAttribute('data-modelcode');
    await addOnAddBtn.click();
    await expect(addOnAddBtn).toContainText('Added');
    await pd.addOn.continueBtn.click();

    // 4. On the Gift page, select any product and click "Continue"
    await pd.gift.section.waitFor();
    const giftAddBtn = pd.gift.addableProducts.addBtn.first();
    const giftSKU = await giftAddBtn.getAttribute('data-modelcode');
    await giftAddBtn.click();
    await expect(giftAddBtn).toContainText('Added');
    await pd.gift.continueBtn.click();

    // 5. Verify that customer can go to Cart page directly
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await expect(cart).containSKU(addOnSKU);
    await expect(cart).containSKU(giftSKU);
    await capture('Cart Page', cart.main);
});
