import { expect, test } from 'fixtures';
import product from 'product';

const title = 'Verify product detail information on cart page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.notIn(['SM-S931BZSCXME']).canBuy });

test(title, { tag }, async ({ context, page, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to MY store
    await page.goto(context.cartURL);
    await cart.waitForLoad();

    // 2. Add product to cart
    // 3. Navigate to cart page
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    // 4. Verify Product image, name, SKU code, Variant unique attribute
    const cartItem = cart.cartItem(product.sku);
    await expect.soft(cartItem.productImage).toBeVisible();
    await expect.soft(cartItem.productName).toBeVisible();
    await expect.soft(cartItem.productSku).toBeVisible();
    await expect.soft(cartItem.stockMessage).toBeVisible();

    // 5. Verify Product Count Number + Text
    await expect.soft(cart.itemCount).toBeVisible();
    await expect.soft(cart.itemCount).toHaveText(/You have \d+ item in your cart/);

    await capture('Cart Page', cart.main);
});
