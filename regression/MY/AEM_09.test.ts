import { expect, test } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add product in Add-on page from BC page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasBC.hasAddOn.canBuy });

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

            // 2. Select product without/with added service and click "Continue" CTA
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
            } else if (await bc.isTradeInOptionSelectable()) {
                await bc.tradeInNoOpt.click();
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
            } else if (await bc.shouldSelectSCP()) {
                await bc.scpNoneOpt.click();
            }
            await bc.addToCartBtn.click();

            // 3. On add-on page click add CTA then click Continue CTA
            await bc.addOn.section.waitFor();
            await bc.addOn.addableProducts.card.first().waitFor();
            const addOnAddBtn = bc.addOn.addableProducts.addBtn.first();
            const addOnSKU = await addOnAddBtn.getAttribute('data-modelcode');
            await addOnAddBtn.click();
            await expect(addOnAddBtn).toContainText('Added');
            await capture(`[${name}] Add-on Added`, bc.addOn.section);
            await bc.addOn.continueBtn.click();

            // 4. Go to cart page verify
            await cart.waitForLoad();
            await expect(cart).containSKU(product.sku);
            await expect(cart).containSKU(addOnSKU);
            await capture(`[${name}] Cart Page`, cart.main);
        });
    });
}
