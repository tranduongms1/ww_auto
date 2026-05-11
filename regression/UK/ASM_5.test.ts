import { test, expect } from 'fixtures';
import account from 'account';
import product from 'product';

const title = 'Reg: Share cart with customer via email';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.any.canReadEmail });
test.use({ product: product.any.hasPD.tradeIn.scp.canBuy });

test(title, { tag }, async ({ context, page, cart }) => {
    const product = context.product!;
    const account = context.account!;

    await test.step('ASM Login', async () => {
        await page.goto(context.shopURL + '?asm=true');

        await expect(page.getByText('Assisted Service Mode'), 'ASM Login is not displayed').toBeVisible({ timeout: 30000 });
        await page.getByRole('textbox', { name: 'Agent ID' }).fill('Automation_Reg');
        await page.getByRole('textbox', { name: 'Password' }).fill('Admin1234!@@');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.getByTitle('Sign out').waitFor();

        await page.waitForTimeout(3000);
        await page.getByRole('textbox', { name: 'Search by name or email address' }).fill(account.email);
        await page.getByRole('button', { name: 'Start Session' }).click();
    });

    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
});
