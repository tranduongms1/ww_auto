import path from 'path';
import { expect, test } from 'fixtures';
import product from 'product';
import { allSites } from '../tests/sites';

for (const site of allSites) {
    test.describe('BC - Add Trade-in', () => {
        test.use({ site });
        test.use({ env: 'prod' });
        test.use({ workingDir: path.join(__dirname, site) });
        test.use({ product: product.any.hasBC.tradeIn.canBuy });

        test(site, async ({ context, page, bc }) => {
            await page.goto(context.product!.bcURL!);
            bc.product = context.product;
            await bc.waitForAddToCartButton();
            await bc.waitForTradeInSection();
            await bc.addTradeIn();
        });
    });
}

for (const site of allSites) {
    test.describe('BC - Add SC+', () => {
        test.use({ site });
        test.use({ env: 'prod' });
        test.use({ workingDir: path.join(__dirname, site) });
        test.use({ product: product.any.hasBC.scp.canBuy });

        test(site, async ({ context, page, bc }) => {
            await page.goto(context.product!.bcURL!);
            bc.product = context.product;
            await bc.waitForAddToCartButton();
            await bc.waitForSCPSection();
            await bc.addSCP();
        });
    });
}

for (const site of allSites) {
    test.describe('PD - Add Trade-up', () => {
        test.use({ site });
        test.use({ env: 'prod' });
        test.use({ workingDir: path.join(__dirname, site) });
        test.use({ product: product.any.hasPD.tradeUp.canBuy });

        test(site, async ({ context, page, pd }) => {
            await page.goto(context.product!.pdURL!);
            pd.product = context.product;
            await pd.waitForAddToCartButton();
            await pd.waitForTradeUpSection();
            await pd.addTradeUp();
        });
    });
}

for (const site of allSites) {
    test.describe('PD - Add Warranty', () => {
        test.use({ site });
        test.use({ workingDir: path.join(__dirname, site) });
        test.use({ product: product.any.hasPD.warranty.canBuy });

        test(site, async ({ context, page, pd }) => {
            await page.goto(context.product!.pdURL!);
            pd.product = context.product;
            await pd.waitForAddToCartButton();
            await pd.waitForWarrantySection();
            await pd.addWarranty();
        });
    });
}

for (const site of allSites) {
    test.describe('Cart', () => {
        test.use({ site });
        test.use({ env: 'prod' });
        test.use({ workingDir: path.join(__dirname, site) });
        test.use({ product: product.any.canBuy });

        test(site, async ({ context, page, cart, checkout }) => {
            await page.goto(cart.url);
            await cart.waitForLoad();
            await cart.addToCart(context.product!);
            await expect(cart).containSKU(context.product!.sku);
            await expect(cart.rhs.couponCodeInput).toBeVisible();
            await expect(cart.rhs.applyCouponBtn).toBeVisible();
            await cart.rhs.couponCodeInput.fill('123456');
            await cart.rhs.applyCouponBtn.click();
            await expect(cart.rhs.couponCodeInput.errorMessage).toBeVisible();
            await cart.continueToCheckout();
            await expect(page).navigatedTo(context.checkoutURL);
            await checkout.waitForLoad();
            await expect(checkout.rhs.couponCodeInput).toBeVisible();
            await expect(checkout.rhs.applyCouponBtn).toBeVisible();
            await checkout.rhs.couponCodeInput.fill('123456');
            await checkout.rhs.applyCouponBtn.click();
            await expect(checkout.rhs.couponCodeInput.errorMessage).toBeVisible();
        });
    });
}
