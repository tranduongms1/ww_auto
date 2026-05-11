import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Product in MBO and Add-on page from BC page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasBC.hasMBO.hasAddOn.canBuy });

test(title, { tag }, async ({ context, page, bc, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access AEM BC page
    bc.product = product;
    await page.goto(product.bcURL!);
    await bc.waitForAddToCartButton();
    await bc.waitForSection('MBO', bc.mboAddBtn.first(), 'hasMBO');

    // 2. Select product and click add added service (Trade-in & SC+) from BC page
    // 3. Sroll to MBO section, click "Add" CTA
    await capture('BC Page Before Add MBO', bc.mboSection);
    const addBtn = bc.mboAddBtn.first();
    const mboSKU = await addBtn.getAttribute('data-modelcode');
    console.log(`MBO SKU: ${mboSKU}`);
    await addBtn.click();
    await expect(addBtn).toHaveText('Added');
    await page.waitForTimeout(3000);
    await capture('BC Page After Add MBO', bc.mboSection);

    // 4. Click "Buy now" CTA
    if (bc.isTradeInOptionSelectable()) {
        await bc.tradeInNoOpt.click();
        console.log('Trade In No option selected');
    }
    if (bc.shouldSelectSCP()) {
        await bc.scpNoneOpt.click();
        console.log('SCP None option selected');
    }
    await bc.addToCartBtn.click();

    // 5. Customer is redirect to Add-on page
    await bc.addOn.section.waitFor();

    // 6. On add-on page, click "add" CTA then click Continue CTA
    const addOnAddBtn = bc.addOn.addableProducts.addBtn.first();
    const addOnSKU = await addOnAddBtn.getAttribute('data-modelcode');
    await addOnAddBtn.click();
    await expect(addOnAddBtn).toContainText('Added');
    await bc.addOn.continueBtn.click();

    // 7. Go to cart page, verify Product in MBO, Gift page and add-on from BC page are added to cart
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await expect(cart).containSKU(mboSKU);
    await expect(cart).containSKU(addOnSKU);
    await capture('Cart Page', cart.main);
});
