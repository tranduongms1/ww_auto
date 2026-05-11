import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Trade-in & Samsung Care+ from PD page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPD.tradeIn.scp.canBuy });

test(title, { tag }, async ({ context, page, pd, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to PD page and verify Trade-in/SC+ component is displayed
    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForTradeInSection();
    await pd.waitForSCPSection();

    // 2. Add Trade-in/SC+ to a main product from PD page
    await test.step('Add Trade-in', async () => {
        await pd.tradeInYesOpt.click();
        await expect(pd.tradeIn.modal).toBeVisible();
        await pd.tradeIn.process();
        await expect(pd.tradeIn.modal).toBeHidden();
        await expect(pd.page.getByText('Congratulations, your trade-in request is successful.')).toBeVisible();
        await capture('PD Page After Add Trade-in', pd.tradeInSection);
    }).catch(() => { throw errors['pd.tradeIn.add.error'] });
    await test.step('Add Samsung Care+', async () => {
        await pd.scpOpts.first().click();
        await expect(pd.scp.modal).toBeVisible();
        await page.waitForTimeout(2000);
        await pd.scp.checkTermsAndConditions();
        await pd.scp.confirmBtn.click();
        await expect(pd.scp.modal).toBeHidden();
        await expect(pd.scpOpts.first()).toContainClass('selected');
        await capture('PD Page After Add SCP', pd.scpSection);
    }).catch(() => { throw errors['pd.scp.add.error'] });

    // 3. Add main product to Cart page
    await pd.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart Page', cart.main);
});
