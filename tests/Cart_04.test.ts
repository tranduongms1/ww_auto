import { expect, test } from 'fixtures';
import product from 'product';

const title = 'Verify Able to increase/ decrease/ remove the product quantity';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, cart, capture, errors }) => {
    const product = context.product!;

    // 1. Access to MY store
    // 2. Add product to Cart page
    await page.goto(context.cartURL);
    await cart.waitForLoad();
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);

    // 3. In cart page, increase/ decrease the product quantity and verify
    const cartItem = cart.cartItem(product.sku);
    await expect(cartItem.quantityInput).toHaveValue('1');
    await test.step('Increase product quantity', async () => {
        const totalText = await cart.rhs.totalAmount.textContent();
        await capture('Before increase quantity', cart.main);
        await cartItem.increaseQuantityBtn.click();
        await expect(cartItem.quantityInput).toHaveValue('2');
        await expect(cart.rhs.totalAmount, 'Total amount not updated after increasing product quantity').not.toHaveText(totalText, { timeout: 30000 });
        await capture('After increase quantity', cart.main);
    });
    await test.step('Decrease product quantity', async () => {
        const totalText = await cart.rhs.totalAmount.textContent();
        await capture('Before decrease quantity', cart.main);
        await cartItem.decreaseQuantityBtn.click();
        await expect(cartItem.quantityInput).toHaveValue('1');
        await expect(cart.rhs.totalAmount, 'Total amount not updated after decreasing product quantity').not.toHaveText(totalText, { timeout: 30000 });
        await capture('After decrease quantity', cart.main);
    });

    // 4. Validate Remove Icon in Product Container
    // 4.1. Click 'No'
    // 4.2. Click 'X' icon
    // 4.3. Click 'Yes'
    const removeModal = page.locator('app-cart-item-remove-modal');
    await cartItem.removeBtn.click();
    await expect(removeModal).toBeVisible();
    await test.step('Click No', async () => {
        await capture('Before click No', cart.main);
        await removeModal.getByRole('button', { name: 'No' }).click();
        await expect(removeModal).toBeHidden();
        await expect(cartItem.removeBtn).toBeVisible();
        await capture('After click No', cart.main);
    });
    await test.step('Click X', async () => {
        await cartItem.removeBtn.click();
        await expect(removeModal).toBeVisible();
        await capture('Before click X', cart.main);
        await removeModal.locator('.modal__close').click();
        await expect(removeModal).toBeHidden();
        await expect(cartItem.removeBtn).toBeVisible();
        await capture('After click X', cart.main);
    });
    await test.step('Click Yes', async () => {
        await cartItem.removeBtn.click();
        await expect(removeModal).toBeVisible();
        await capture('Before click Yes', cart.main);
        await removeModal.getByRole('button', { name: 'Yes' }).click();
        await expect(removeModal).toBeHidden();
        await expect(cartItem.section).toBeHidden();
        await capture('After click Yes', cart.main);
    });
});
