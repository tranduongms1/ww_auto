import { expect, Page } from 'fixtures';
import SSO from 'SSO';

export async function login(page: Page) {
    const context = page.context();
    const sso = new SSO(page);
    const account = context.account!;

    await page.goto(context.homeURL);
    const signInBtn = page.getByRole('button', { name: 'Sign in with Samsung' });
    await expect.soft(signInBtn, 'Sign in with Samsung button is not visible').toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);

    await signInBtn.click();
    await expect(page).navigatedTo(sso.loginURL);
    await sso.signInByEmail(account.email, account.password);
    await expect(page).navigatedTo(context.shopURL);
}
