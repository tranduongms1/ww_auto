import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Samsung Care+ from BC page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasBC.scp.canBuy });

test(title, { tag }, async ({ context, page, bc, cart, capture }) => {
    const product = context.product!;

    // 1. Go to BC page and verify SMC is displayed on BC page
    bc.product = product;
    await page.goto(product.bcURL!);
    await bc.waitForAddToCartButton();
    await bc.waitForSCPSection();

    // 2. Add Samsung Care+ to a main product from BC page
    await bc.scpOpts.first().click();
    await expect(bc.scp.modal).toBeVisible();
    await bc.scp.checkTermsAndConditions();
    await bc.scp.confirmBtn.click();
    await expect(bc.scp.modal).toBeHidden();
    await expect(bc.scpOpts.first()).toContainClass('is-checked');
    await capture('BC Page After Add SMC A', bc.scpSection);

    // 3. Switch SMC from SMC A to SMC B
    await bc.scpOpts.last().click();
    await expect(bc.scp.modal).toBeVisible();
    await bc.scp.checkTermsAndConditions();
    await bc.scp.confirmBtn.click();
    await expect(bc.scp.modal).toBeHidden();
    await expect(bc.scpOpts.last()).toContainClass('is-checked');
    await capture('BC Page After Switch SMC', bc.scpSection);

    // 4. Click " Buy now" CTA and Add Samsung Care+ from BC page to Cart page
    await bc.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart After Add SMC', cart.main);

    // 5. Remove Samsung Care+ in Cart page
    await capture('Cart After Remove SMC', cart.main);
});
