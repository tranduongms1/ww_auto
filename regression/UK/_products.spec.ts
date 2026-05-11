import { test } from 'fixtures';
import product from 'product';

test.use({ site: 'UK' });

test.setTimeout(120000);

const noop = () => { };

for (const { sku } of require('./stg2_products.json')) {
    test.describe(() => {
        test.use({ product: product.sku(sku) });

        test(sku, async ({ context, page, bc, pd, cart }, testInfo) => {
            const p = context.product!;
            if (p.bcURL) {
                bc.product = p;
                await page.goto(p.bcURL);
                await bc.waitForLoad();
                await page.waitForTimeout(10000);
                await bc.tradeInSection.isVisible().then(v => v ? (p.tradeIn = true) : (typeof p.tradeIn === 'boolean' && (p.tradeIn = false))).catch(noop);
                await bc.scpSection.isVisible().then(v => v ? (p.scp = true) : (typeof p.scp === 'boolean' && (p.scp = false))).catch(noop);
                await bc.simSection.isVisible().then(v => v ? (p.sim = true) : (typeof p.sim === 'boolean' && (p.sim = false))).catch(noop);
                await bc.galaxyClubSection.isVisible().then(v => v ? (p.galaxyClub = true) : (typeof p.galaxyClub === 'boolean' && (p.galaxyClub = false))).catch(noop);
                if (typeof p.canBuy === 'boolean') {
                    delete p.canBuy;
                    p.canBuy = await bc.addToCartBtn.isEnabled().catch(() => false);
                }
                if (typeof p.outOfStock === 'boolean') {
                    delete p.outOfStock;
                    p.outOfStock = await bc.getStockAlertBtn.isVisible().catch(() => false);
                }
                await page.screenshot({ fullPage: true, path: testInfo.outputPath('BC.jpg') });
            } else if (p.pdURL) {
                pd.product = p;
                await page.goto(p.pdURL);
                await pd.waitForLoad();
                await page.waitForTimeout(10000);
                await pd.tradeInSection.or(pd.tradeUpSection).isVisible().then(v => v ?
                    (p.type === 'IM' ? (p.tradeIn = true) : (p.tradeUp = true)) :
                    (p.type === 'IM' ? (typeof p.tradeIn === 'boolean' && (p.tradeIn = false)) : (typeof p.tradeUp === 'boolean' && (p.tradeUp = false)))
                ).catch(noop);
                await pd.scpSection.isVisible().then(v => v ? (p.scp = true) : (typeof p.scp === 'boolean' && (p.scp = false))).catch(noop);
                await pd.warrantySection.isVisible().then(v => v ? (p.warranty = true) : (typeof p.warranty === 'boolean' && (p.warranty = false))).catch(noop);
                if (typeof p.canBuy === 'boolean') {
                    delete p.canBuy;
                    p.canBuy = await pd.addToCartBtn.isEnabled().then(() => true).catch(() => false);
                }
                if (typeof p.outOfStock === 'boolean') {
                    delete p.outOfStock;
                    p.outOfStock = await pd.getStockAlertBtn.isVisible().catch(() => false);
                }
                await page.screenshot({ fullPage: true, path: testInfo.outputPath('PD.jpg') });
            } else if (typeof p.canBuy == 'boolean') {
                await page.goto(cart.url);
                await cart.waitForLoad();
                delete p.canBuy;
                p.canBuy = await cart.addToCart(p).then(() => true).catch(() => false);
                await page.screenshot({ fullPage: true, path: testInfo.outputPath('Cart.jpg') });
            }
        });
    });
}
