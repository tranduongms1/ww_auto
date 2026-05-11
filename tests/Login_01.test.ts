import { test, expect } from 'fixtures';
import { createTempEmail, getOTPCode } from 'moakt';
import product from 'product';

const title = 'Verify able to Sign up from AEM GNB';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasBC.canBuy });

test(title, { tag }, async ({ context, page, accounts, home, sso, bc, cart, capture }) => {
    const [emailPage, email] = await createTempEmail(context);

    // 1. Navigate to MY AEM page
    await page.bringToFront();
    await page.goto(context.homeURL);
    await home.gnb.humanIcon.click();
    await capture('Before Sign up');

    // 2. Click on "Sign-up" button in the storefront and validate that user should be redirected to the create account page in Samsung.
    await home.gnb.loginLink.click();
    await expect(page).navigatedTo(sso.loginURL);
    await sso.createAccountBtn.waitFor();
    await sso.autoZoom();
    await capture('Login Page');
    await sso.createAccountBtn.click();
    await expect(page).toHaveURL(/terms/, { timeout: 30000 });

    // 3. Click Agree at "Create your Samsung account" page
    await sso.termAndConditionsCbxs.check({ force: true });
    await sso.autoZoom();
    await capture('Terms and Conditions');
    await sso.agreeBtn.click();

    // 4. Enter below details and click on "Continue" button
    // --Email ID (try to enter enter invalid format ex: missing @, user@.com, special character other than .-_+, )
    // --Password
    // --Confirm Password
    // --First Name
    // --Last Name
    // --Date of birth
    await expect(page).toHaveURL(/informations/, { timeout: 30000 });
    const password = 'Pass@word1';
    await sso.accountInput.fill(email);
    await sso.passwordInput.fill(password);
    await sso.confirmPasswordInput.fill(password);
    await sso.firstNameInput.fill('Auto');
    await sso.lastNameInput.fill('Test');
    await sso.dayInput.fill('1');
    await sso.monthSelect.selectOption({ index: 4 });
    await sso.yearInput.fill('1988');
    await sso.autoZoom();
    await capture('Informations');
    await sso.nextBtn.click();
    await expect(page).toHaveURL(/verifications/, { timeout: 30000 });

    // 5. Open email register in step 4 then enter OTP in Email verification page
    // 5.1 Enter invalid OTP
    // 5.2 Enter valid OTP
    const otp = await getOTPCode(emailPage);
    await sso.otpInput.fill('000000');
    await sso.otpInput.blur();
    await expect(sso.otpInputError).toHaveText('Invalid OTP');
    await sso.autoZoom();
    await capture('Invalid OTP');
    await sso.otpInput.fill(otp);
    await sso.otpInput.blur();
    await capture('Valid OTP');
    await sso.nextBtn.click();

    // 6. After verification is done -> Click "DONE" button -> back to home page
    await expect(page).toHaveURL(/complete/, { timeout: 30000 });
    await sso.autoZoom();
    await capture('Complete');
    await sso.doneBtn.click();
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

    await expect(page).navigatedTo(context.homeURL);
    await home.gnb.humanIcon.waitFor();
    await capture('After Sign up');

    // 7. SignUp Complete page is opened -> Click "LOGIN" button
    await home.gnb.humanIcon.hover();
    await capture('AEM User Menu');

    // 8. Add a product from AEM > cart
    bc.product = context.product!;
    await page.goto(bc.product!.bcURL);
    await bc.waitForAddToCartButton();
    await capture('BC Page');
    await bc.continueToCart();
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(bc.product!.sku);
    await capture('Cart Page', cart.main);

    // 9. Hover mouse over the Human icon, then click on Log out
    await cart.gnb.humanIcon.hover();
    await capture('Cart User Menu');
    await cart.gnb.logoutLink.click();
    await expect(page).navigatedTo(sso.loginURL);
    await capture('CartAfter Log out');
});
