import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify Checkout flow backwards and forward for Golden Flow from AEM BC';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasBC.tradeIn.scp.canBuy });
test.use({ product2: product.any.CE.canBuy });

test(title, { tag }, async ({ context, page, bc, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    bc.product = product;
    await page.goto(product.bcURL!);

    await bc.waitForAddToCartButton();
    await bc.waitForTradeInSection();
    await bc.waitForSCPSection();

    await bc.continueToCart();

    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);

    await cart.addToCart(product2);
    await expect(cart).containSKU(product2.sku);

    await cart.continueToCheckout();
});
