import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify Update cart by clicking on "Edit" button in checkout order summary';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.tradeIn.scp.canBuy });
test.use({ product2: product.any.tradeUp.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;

    await page.goto(context.cartURL);
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
    await cart.addToCart(product2);
    await expect(cart).containSKU(product2.sku);

    await cart.continueToCheckout();
    await expect(page).navigatedTo(context.checkoutURL);
});
