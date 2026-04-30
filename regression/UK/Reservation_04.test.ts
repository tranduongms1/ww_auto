import { test, expect } from 'fixtures';
import order from 'order';
import product from 'product';

const title = 'Able to purchase reservation product when previous order is cancelled';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ order: order.reservation });

test(title, { tag }, async ({ context, page, products, cart }) => {
    const order = context.order!;
    const sku = order.products.find(p => p.reservation).sku;
    const prod = await product.sku(sku).canBuy.findOne(products);

    if (order.status != 'Cancelled') {
        order.status = 'Cancelled';
    }

    await page.goto(context.cartURL);

    await cart.addToCart(prod);
    await expect(cart).toContainSKU(prod.sku);
});
