import { test, expect } from 'fixtures';
import account from 'account';

const title = 'SMB registration - Auto Rejected';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ siteUid: 'uk_business' });
test.use({ account: account.any.notEppRegistered('uk_business') });

test(title, { tag }, async ({ context, page, sso }) => {
    await page.goto(context.shopURL() + '/login/business');

    const signInBtn = page.getByRole('button', { name: 'Sign in' });
    await expect.soft(signInBtn, 'Sign in button is not visible').toBeVisible({ timeout: 30000 });

    await signInBtn.click();
    await expect(page, 'Not navigated to SSO login after clicking "Sign in" button').navigatedTo(sso.loginURL);

    const account = context.account!;
    await sso.signInByEmail(account.email, account.password);

    await expect(page, 'Not navigated to SMB registration page after login').navigatedTo(context.shopURL() + '/sme-registration');

    await test.step('SMB registration process', async () => {
        await page.getByRole('heading', { name: 'Verify your Samsung Account details' }).waitFor({ timeout: 30000 });
        await page.getByRole('textbox', { name: 'phone' }).fill('07791154325');
        await page.getByRole('combobox', { name: 'Job Role/Department' }).click();
        await page.getByRole('option', { name: 'IT and Support' }).click({ timeout: 10000 });
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByRole('combobox', { name: 'Company Type' }).click();
        await page.getByRole('option', { name: 'Limited', exact: true }).click({ timeout: 10000 });
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByRole('heading', { name: 'Company Information' }).waitFor({ timeout: 5000 });
        await page.getByRole('textbox', { name: 'companyRegistrationNumber' }).fill('03855289');
        await page.getByRole('option').first().click({ timeout: 15000 });
        await page.getByRole('button', { name: 'Next' }).click();

        await page.getByRole('heading', { name: 'Samsung for Business Agreement' }).waitFor({ timeout: 5000 });
        for (const cbx of await page.getByRole('checkbox').all()) {
            await cbx.check({ force: true });
        }
        await page.getByRole('button', { name: 'Create Business Account' }).click();

        account.eppRegistered!.push('uk_business');
    });

    await expect(page, 'Not navigated to register success page after SMB registration').navigatedTo(context.shopURL() + '/sme-register-success');
    await expect(page.getByRole('heading', { name: 'Registration is not approved' }), '"Registration is not approved" heading is not visible').toBeVisible({ timeout: 30000 });
});
