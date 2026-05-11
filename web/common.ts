import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { expect, test, Page, } from 'fixtures';
import GNB from './GNB';
import SSO from './SSO';

const noop = () => { };

export async function loginWDS(page: Page) {
    const wmcNotice = page.locator('[name="wmcNotice"]');
    await page.addLocatorHandler(
        wmcNotice,
        (l) => l.locator('[name="close"]').click()
    ).catch(noop);
    for (let tries = 1; tries <= 2; tries++) {
        try {
            const loginPopupOpened = page.context().waitForEvent('page', { timeout: 10000 }).catch(noop);
            await page.locator('.employees img[alt="login"]').click();
            const loginPopup = await loginPopupOpened as Page;
            try {
                await loginPopup.locator('[id="userNameInput"]').waitFor({ timeout: 10000 });
                await loginPopup.waitForTimeout(2000);
                await loginPopup.locator('[id="userNameInput"]').fill('wj4153.kim');
                await loginPopup.locator('[id="passwordInput"]').fill('Wise123!@#');
                await loginPopup.locator('.submitMargin .submit').click();
                await loginPopup.waitForEvent('close', { timeout: 10000 }).catch(() => loginPopup.close().catch(noop));
            } catch (e: any) {
                if (!e?.message.includes('browser has been closed')) throw e;
            }
            const newTabOpened = page.context().waitForEvent('page').catch(noop);
            await page.getByRole('link', { name: 'Preqa2' }).first().click({ timeout: 10000 });
            const newTab = await newTabOpened as Page;
            await newTab.waitForLoadState();
            await newTab.close().catch(noop);
            await page.removeLocatorHandler(wmcNotice).catch(noop);
            break;
        } catch (cause: any) {
            if (cause?.message.includes('Test ended')) return;
            if (tries == 2) throw new Error('Failed to login to WDS', { cause });
            await page.waitForTimeout(5000);
            console.error('Failed to login to WDS, retrying...');
            await page.reload();
        }
    }
}

export async function login(page: Page) {
    const context = page.context();
    const { email, password } = context.account!;
    const currentURL = page.url();
    const gnb = new GNB(page);
    const sso = new SSO(page);

    await gnb.section.waitFor();
    if (await gnb.userLoggedInIcon.waitFor({ timeout: 5000 }).then(() => true).catch(() => false)) {
        console.log('User is already logged in');
        return;
    }

    console.log('Logging in as', email);
    await gnb.humanIcon.hover();
    await gnb.loginLink.click();
    await expect(page).navigatedTo(sso.loginURL);
    await sso.signInByEmail(email, password);
    console.log('Login success with email', email);
    if (page.url() !== currentURL) {
        await page.goto(currentURL);
    }
    await gnb.section.waitFor();
    await gnb.userLoggedInIcon.waitFor().catch(() => {
        throw new Error('Login Error: loss login session after login');
    });

    const dir = path.join(path.dirname(test.info().file), '.auth');
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    const id = email.replaceAll(/[^\w]/g, '_').toLowerCase();
    const filename = path.join(dir, id + '.json');
    await context.storageState({ path: filename });
    console.log('Login session saved to', filename);
}

export async function selectCountry(page: Page) {
    const modal = page.locator('app-country-selector-modal:visible');
    switch (page.context().site) {
        case 'AE':
        case 'AE_AR':
            await modal.locator('.modal__close').click();
            return;
        case 'BH':
            await modal.getByText('Bahrain').click();
            break;
        case 'BH_AR':
            await modal.getByText('البحرين').click();
            break;
        case 'KW':
            await modal.getByText('Kuwait').click();
            break;
        case 'KW_AR':
            await modal.getByText('الكويت').click();
            break;
        case 'OM':
            await modal.getByText('Oman').click();
            break;
        case 'OM_AR':
            await modal.getByText('عمان').click();
            break;
        case 'QA':
            await modal.getByText('Qatar').click();
            break;
        case 'QA_AR':
            await modal.getByText('قطر').click();
            break;
        default:
            return;
    }
    await modal.locator('[data-an-la="country selector popup:continue"]').click();
    await modal.waitFor({ state: 'hidden' });
    await page.waitForLoadState();
}
