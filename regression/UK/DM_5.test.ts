import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify Pre-selected delivery slots display correctly in checkout page';
const tag = ['@Core'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasDeliveryOption('SEUK-DPD').hasDeliveryOption('SEUK-DPD-WEEKDAY-ALLDAY-WEEE-50-G1-BO').canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;

    await page.goto(context.cartURL());

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
