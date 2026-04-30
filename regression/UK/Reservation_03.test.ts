import { test, expect } from 'fixtures';
import order from 'order';
import product from 'product';

const title = 'AC6_1: Validate unable to checkout if customer already purchase reservation product before';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ order: order.reservation.notCancelled });

test(title, { tag }, async ({ context, page, products, cart }) => {
    const order = context.order!;
    const sku = order.products.find(p => p.reservation).sku;
    const prod = await product.sku(sku).canBuy.findOne(products);

    await page.goto(context.cartURL);

    await cart.addToCart(prod);
    await expect(cart).toContainSKU(prod.sku);
});
