import { Page } from 'fixtures';

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
