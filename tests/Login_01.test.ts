import { test, expect } from 'fixtures';
import { createTempEmail, getOTPCode } from 'moakt';

const title = 'Sign up function';
const tag = ['@Core'];

test.use({ site: 'UK' });

test.setTimeout(180000);

test(title, { tag }, async ({ context, page, accounts, sso, cart }) => {
    const [emailPage, email] = await createTempEmail(context);

    await page.bringToFront();
    await page.goto(context.homeURL);
    await page.goto(context.cartURL);

    await cart.empty.signInBtn.waitFor();
    await page.waitForTimeout(3000);
    await expect(cart.empty.signInBtn, 'Sign in button on cart empty page is not visible').toBeVisible();
    await expect(cart.empty.signInBtn, 'Sign in button on cart empty page is not enabled').toBeEnabled();
    await cart.empty.signInBtn.click();
    await expect(page, 'Not navigated to SSO login after clicking empty cart "Sign in" button').navigatedTo(sso.loginURL);

    await sso.createAccountBtn.click();
    await expect(page, 'Not navigated to Terms and Conditions step after clicking "Create Account" button').toHaveURL(/terms/, { timeout: 30000 });
    await sso.termAndConditionsCbxs.check({ force: true });
    await sso.agreeBtn.click();

    await expect(page, 'Not navigated to Informations step after clicking "Agree" button').toHaveURL(/informations/, { timeout: 30000 });
    const password = 'Pass@word1';
    await sso.accountInput.fill(email);
    await sso.passwordInput.fill(password);
    await sso.confirmPasswordInput.fill(password);
    await sso.firstNameInput.fill('Auto');
    await sso.lastNameInput.fill('Test');
    await sso.dayInput.fill('1');
    await sso.monthSelect.selectOption({ index: 4 });
    await sso.yearInput.fill('1988');
    await sso.nextBtn.click();

    await expect(page, 'Not navigated to OTP verification step after clicking next button').toHaveURL(/verifications/, { timeout: 30000 });
    const otp = await getOTPCode(emailPage);
    await page.bringToFront();
    await sso.otpInput.fill(otp);
    await sso.nextBtn.click();

    await expect(page, 'Not navigated to Login Complete step after clicking next button').toHaveURL(/complete/, { timeout: 30000 });
    await sso.doneBtn.click();

    await expect.soft(page, 'Not navigated to Home page after signing up').navigatedTo(context.cartURL);
    accounts.push({
        email,
        password,
        emailInbox: { url: 'https://moakt.com/', email },
        addressCount: 0,
        orderCount: 0,
        wishlistCount: 0,
        eppRegistered: [],
        lastLoginAt: new Date()
    });
});
