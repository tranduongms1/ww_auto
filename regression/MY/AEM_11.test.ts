import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add Samsung Care+ from PD page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPD.scp.canBuy });

test(title, { tag }, async ({ context, page, pd, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to IM PD page and verify Samsung Care+ is displayed
    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForSCPSection();

    // 2. Click Samsung Care+ option and Verify Samsung Care+ pop-up
    await test.step('Add SCP', async () => {
        await pd.scpOpts.first().click();
        await expect(pd.scp.modal).toBeVisible();
        await page.waitForTimeout(2000);
        await pd.scp.checkTermsAndConditions();
        await expect(pd.scp.confirmBtn).toBeEnabled();
        await pd.scp.confirmBtn.click();
        await expect(pd.scp.modal).toBeHidden();
        await expect(pd.scpOpts.first()).toContainClass('selected');
        await capture('PD Page After Add SCP', pd.scpSection);
    }).catch(() => { throw errors['pd.scp.add.error'] });

    // 5. Remove Samsung Care+ then verify Samsung Care+ service line not display
    await capture('Cart Page After Remove SCP', cart.main);

    // 6. Back to PD page, Add Samsung Care+ again in PD page to cart. Verify error message
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.waitForSCPSection();
    await test.step('Add Samsung Care+ again', async () => {
        await pd.scpOpts.first().click();
        await expect(pd.scp.modal).toBeVisible();
        await page.waitForTimeout(2000);
        await pd.scp.checkTermsAndConditions();
        await pd.scp.confirmBtn.click();
        await expect(pd.scp.modal).toBeHidden();
        await expect(pd.scpOpts.first()).toContainClass('selected');
        await capture('PD Page After Add SCP Again', pd.scpSection);
    }).catch(() => { throw errors['pd.scp.add.again.error'] });
});
