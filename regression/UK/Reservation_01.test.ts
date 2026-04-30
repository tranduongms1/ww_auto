import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AC5_1: Validate unable to checkout reservation product with Guest user, when adding reservation product to cart already has products, when adding another item to cart already has reservation product and has multiple QTY';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.reservation.canBuy });
test.use({ product2: product.noReservation.canBuy });

test.describe(title, { tag }, () => {
    test('Checkout with Guest user', async ({ context, page, cart }) => {
        const product = context.product!;

        await page.goto(context.cartURL);

        await cart.addToCart(product);
        await expect(cart).toContainSKU(product.sku);
    });

    test('Adding reservation product to cart already has products', async ({ context, page, cart }) => {
        const product = context.product!;
        const product2 = context.product2!;

        await page.goto(context.cartURL);

        await cart.addToCart(product2);
        await expect(cart).toContainSKU(product2.sku);
    });

    test('Adding another item to cart already has reservation product and has multiple QTY', async ({ context, page, cart }) => {
        const product = context.product!;
        const product2 = context.product2!;

        await page.goto(context.cartURL);

        await cart.addToCart(product);
        await expect(cart).toContainSKU(product.sku);
    });
});
