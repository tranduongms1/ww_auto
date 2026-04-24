import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify adding Product with SIM to Cart';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.IM.noSIM.noSCP.canBuy });
test.use({ product2: product.any.IM.sim.noSCP.canBuy });
test.use({ product3: product.any.IM.sim.scp.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const product2 = context.product2!;
    const product3 = context.product3!;

    await page.goto(context.cartURL());

    await cart.addToCart(product);
    await expect(cart).toContainSKU(product.sku);
});
