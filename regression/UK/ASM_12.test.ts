import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Guest: Desktop: Shared cart will always be the latest cart for the customer';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any.canReadEmail });
test.use({ product: product.any.canBuy });
test.use({ product2: product.any.canBuy.nth(2) });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;
    const product = context.product!;
    const product2 = context.product2!;

    await test.step('ASM Login', async () => {
        await page.goto(context.shopURL + '?asm=true');

        await expect(page.getByText('Assisted Service Mode'), 'ASM Login is not displayed').toBeVisible({ timeout: 30000 });
        await page.getByRole('textbox', { name: 'Agent ID' }).fill('Automation_Reg');
        await page.getByRole('textbox', { name: 'Password' }).fill('Admin1234!@@');
        await page.getByRole('button', { name: 'Sign in' }).first().click();
        await page.getByTitle('Sign out').waitFor();

        await page.waitForTimeout(3000);
    });

    const shareCartBtn = page.getByRole('button', { name: 'Share basket' });
    const shareCartDialog = page.getByRole('dialog', { name: 'Share basket' });
    const successMessage = page.getByRole('alert').filter({ hasText: 'Share Basket was successful' });

    await test.step('Share first cart to customer', async () => {
        await page.goto(context.cartURL);
        await cart.addToCart(product);
        await expect(cart).containSKU(product.sku);
        await expect(shareCartBtn).toBeVisible();

        await shareCartBtn.click();
        await expect(shareCartDialog).toBeVisible();
        await shareCartDialog.getByRole('textbox', { name: 'Recipient Email' }).fill(account.email);
        await shareCartDialog.getByRole('textbox', { name: 'Message' }).fill('Please check out my basket');
        await shareCartDialog.getByRole('button', { name: 'Share basket' }).click();

        await expect(shareCartDialog, 'Share Cart Error: share cart dialog is not closed after sharing').toBeHidden({ timeout: 15000 });
        await expect(successMessage, 'Share Cart Error: share cart success message is not displayed').toBeVisible();
    });

    await test.step('ASM sign out and login again', async () => {
        await page.getByTitle('Sign out').click();
        await page.getByRole('textbox', { name: 'Agent ID' }).fill('Automation_Reg');
        await page.getByRole('textbox', { name: 'Password' }).fill('Admin1234!@@');
        await page.getByRole('button', { name: 'Sign in' }).first().click();
        await page.getByTitle('Sign out').waitFor();

        await page.waitForTimeout(3000);
    });

    await test.step('Share second cart to customer', async () => {
        await page.goto(context.cartURL);
        await cart.addToCart(product2);
        await expect(cart).containSKU(product2.sku);
        await expect(shareCartBtn).toBeVisible();

        await shareCartBtn.click();
        await expect(shareCartDialog).toBeVisible();
        await shareCartDialog.getByRole('textbox', { name: 'Recipient Email' }).fill(account.email);
        await shareCartDialog.getByRole('textbox', { name: 'Message' }).fill('Please check out my basket');
        await shareCartDialog.getByRole('button', { name: 'Share basket' }).click();

        await expect(shareCartDialog, 'Share Cart Error: share cart dialog is not closed after sharing').toBeHidden({ timeout: 15000 });
        await expect(successMessage, 'Share Cart Error: share cart success message is not displayed').toBeVisible();
    });
});
