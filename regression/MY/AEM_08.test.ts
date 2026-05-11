import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add MBO from BC page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasBC.hasMBO.canBuy });

for (const name of ['No Added Service', 'Trade-in', 'SCP', 'Trade-in and SCP']) {
    test.describe(title, { tag }, () => {
        let productQuery = product.any.hasBC.hasMBO;
        if (name.includes('Trade-in')) productQuery = productQuery.tradeIn;
        if (name.includes('SCP')) productQuery = productQuery.scp;
        test.use({ product: productQuery.canBuy });

        test(name, { tag }, async ({ context, page, bc, cart, capture, errors }) => {
            const product = context.product!;

            // 1. Access AEM BC page
            bc.product = product;
            await page.goto(product.bcURL!);
            await bc.waitForAddToCartButton();
            await bc.waitForSection('MBO', bc.mboAddBtn.first(), 'hasMBO');

            // 2. Select product without/with added service
            if (name.includes('Trade-in')) {
                await test.step('Add Trade-in', async () => {
                    await bc.waitForTradeInSection();
                    await bc.tradeInYesOpt.click();
                    await expect(bc.tradeIn.modal).toBeVisible();
                    await bc.tradeIn.process();
                    await expect(bc.tradeIn.modal).toBeHidden();
                    await expect(bc.page.getByText('Congratulations, your trade-in request is successful.')).toBeVisible();
                    await capture(`[${name}] BC Page After Add Trade-in`, bc.tradeInSection);
                }).catch(() => { throw errors['bc.tradeIn.add.error'] });
            }
            if (name.includes('SCP')) {
                await test.step('Add SCP', async () => {
                    await bc.waitForSCPSection();
                    await bc.scpOpts.first().click();
                    await expect(bc.scp.modal).toBeVisible();
                    await bc.scp.checkTermsAndConditions();
                    await bc.scp.confirmBtn.click();
                    await expect(bc.scp.modal).toBeHidden();
                    await expect(bc.scpOpts.first()).toContainClass('is-checked');
                    await capture(`[${name}] BC Page After Add SCP`, bc.scpSection);
                }).catch(() => { throw errors['bc.scp.add.error'] });
            }

            // 3. Sroll to MBO section, click add CTA
            await bc.mboSection.scrollIntoViewIfNeeded();
            await capture(`[${name}] MBO Section`, bc.mboSection);
            const addBtn = bc.mboAddBtn.first();
            const mboSKU = await addBtn.getAttribute('data-modelcode');
            console.log(`[${name}] MBO SKU: ${mboSKU}`);
            await addBtn.click();
            await expect(addBtn).toHaveText('Added');
            await page.waitForTimeout(3000);
            await capture(`[${name}] MBO Section After Click Add CTA`, bc.mboSection);

            // 4. Click "Buy now" CTA
            await bc.continueToCart();
            await expect(page).navigatedTo(context.cartURL);

            // 5. Go to cart page verify
            await cart.waitForLoad();
            await expect(cart).containSKU(product.sku);
            await expect(cart).containSKU(mboSKU);
            await capture(`[${name}] Cart Page`, cart.main);
        });
    });
}
