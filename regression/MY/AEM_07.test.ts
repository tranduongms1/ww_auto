import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Trade-in & Samsung Care+ from BC page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasBC.tradeIn.scp.canBuy });

test(title, { tag }, async ({ context, page, bc, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to BC page and verify Trade-in/SC+ component is displayed
    bc.product = product;
    await page.goto(product.bcURL!);
    await bc.waitForAddToCartButton();
    await bc.waitForTradeInSection();
    await bc.waitForSCPSection();

    // 2. Add Trade-in/SC+ to a main product from BC page
    await test.step('Add Trade-in', async () => {
        await bc.tradeInYesOpt.click();
        await expect(bc.tradeIn.modal).toBeVisible();
        await bc.tradeIn.process();
        await expect(bc.tradeIn.modal).toBeHidden();
        await expect(bc.page.getByText('Congratulations, your trade-in request is successful.')).toBeVisible();
        await capture('BC Page After Add Trade-in', bc.tradeInSection);
    }).catch(() => { throw errors['bc.tradeIn.add.error'] });

    await test.step('Add SCP', async () => {
        await bc.scpOpts.first().click();
        await expect(bc.scp.modal).toBeVisible();
        await bc.scp.checkTermsAndConditions();
        await bc.scp.confirmBtn.click();
        await expect(bc.scp.modal).toBeHidden();
        await expect(bc.scpOpts.first()).toContainClass('is-checked');
        await capture('BC Page After Add SCP', bc.scpSection);
    }).catch(() => { throw errors['bc.scp.add.error'] });

    // 3. Add main product to Cart page
    await bc.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart Page', cart.main);

    // 4. Remove add Trade-in/SC+ then add it again from Cart page
    await capture('Cart After Remove Trade-in', cart.main);

    await capture('Cart After Remove SCP', cart.main);

    await capture('Cart After Add Trade-in', cart.main);

    await capture('Cart After Add SCP', cart.main);
});
