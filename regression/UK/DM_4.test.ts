import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify NextDayDelta Price is displayed correctly on the checkout page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.CE.hasDeliveryOption('SEUK-PANTHER-2M').canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL());

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
