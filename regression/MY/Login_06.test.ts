import { expect, test } from 'fixtures';
import product from 'product';
import { createTempEmail, getOTPCode } from 'moakt';

const title = 'Verify user is able to Sign up from Splash page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.canBuy });

test(title, { tag }, async ({ context, page, accounts, cart, sso, checkout, capture, errors }) => {
    const [emailPage, email] = await createTempEmail(context);
    const product = context.product!;

    // 1. Navigate to MY store
    await page.bringToFront();
    await page.goto(context.homeURL);

    // 2. Add a product to cart page
    await page.goto(cart.url);
    await cart.waitForLoad();
    await cart.addToCart(product);
    await expect(cart).containSKU(product.sku);
    await capture('Cart Page', cart.main);

    // 3. Click 'Continue to checkout' CTA and validate that user should be directed to splash page
    await cart.rhs.checkoutBtn.click();
    await expect(page).navigatedTo(context.splashURL);

    // 4. In splash page, click 'Sign up to earn Samsung Reward' link and validate that user should be redirect to the create account page in Samsung
    await page.getByRole('link', { name: 'Sign up to earn Samsung Reward' }).click();

    // 5. Click Agree at "Create your Samsung account" page
    await sso.termAndConditionsCbxs.check({ force: true });
    await sso.autoZoom();
    await capture('Terms and Conditions');
    await sso.agreeBtn.click();

    // 6. Enter below details and click on "Continue" button
    // --Email ID (try to enter enter invalid format ex: missing @, user@.com, special character other than .-_+, )
    // --Password
    // --Confirm Password
    // --First Name
    // --Last Name
    // --Date of birth
    const password = 'Pass@word1';
    await expect(page).toHaveURL(/informations/, { timeout: 30000 });
    await sso.accountInput.fill(email);
    await sso.passwordInput.fill(password);
    await sso.confirmPasswordInput.fill(password);
    await sso.firstNameInput.fill('Auto');
    await sso.lastNameInput.fill('Test');
    await sso.dayInput.fill('1');
    await sso.monthSelect.selectOption({ index: 4 });
    await sso.yearInput.fill('1988');
    await sso.nextBtn.click();
    await expect(page).toHaveURL(/verifications/, { timeout: 30000 });

    // 7. Open email register in step 4 then enter OTP in Email verification page
    const otp = await getOTPCode(emailPage);
    await sso.otpInput.fill(otp);
    await sso.otpInput.blur();
    await capture('Enter OTP');
    await sso.nextBtn.click();

    // 8. After verification is done -> Click "DONE" button
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

    // 9. Verify User is able to Sign up from Splash page and directed to checkout page
    await expect(page).navigatedTo(context.checkoutURL);
    await checkout.waitForLoad();
    await capture('Checkout Page');
});
