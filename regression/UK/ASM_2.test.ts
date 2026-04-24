import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Guest: ASM Login';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ product: product.any.hasPD.canBuy });

test(title, { tag }, async ({ context, page, pd, cart }) => {
    const product = context.product!;

    await page.goto(context.shopURL() + '?asm=true');

    expect(page.getByText('Assisted Service Mode'), 'ASM Login is not displayed').toBeVisible({ timeout: 30000 });
    await page.getByRole('textbox', { name: 'Agent ID' }).fill('admin.trang.luong');
    await page.getByRole('textbox', { name: 'Password' }).fill('Wise12a@');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByTitle('Sign out').waitFor();

    await page.waitForTimeout(3000);

    pd.product = product;
    await page.goto(product.pdURL!);
    await pd.waitForAddToCartButton();
    await pd.addToCartBtn.click();

    await expect(page).navigatedTo(context.cartURL());
    await cart.waitForLoad();
    await expect(cart).toContainSKU(product.sku);
    await expect(page.getByRole('button', { name: 'Share basket' })).toBeVisible();
    await expect(cart.rhs.checkoutBtn).toBeVisible();
});
