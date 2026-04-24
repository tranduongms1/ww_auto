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
            if (await loginPopup.waitForSelector('[id="userNameInput"]', { timeout: 5000 }).then(() => true).catch(e => {
                if (!e?.message.includes('browser has been closed')) throw e;
                return false;
            })) {
                await loginPopup.locator('[id="userNameInput"]').waitFor();
                await loginPopup.waitForTimeout(2000);
                await loginPopup.locator('[id="userNameInput"]').fill('wj4153.kim');
                await loginPopup.locator('[id="passwordInput"]').fill('Wise123!@#');
                await loginPopup.locator('.submitMargin .submit').click();
                await loginPopup.waitForEvent('close', { timeout: 15000 }).catch(() => loginPopup.close().catch(noop));
            }
            const newTabOpened = page.context().waitForEvent('page');
            await page.getByRole('link', { name: 'Preqa2' }).first().click();
            const newTab = await newTabOpened;
            await newTab.waitForLoadState();
            await newTab.close().catch(noop);
            await page.removeLocatorHandler(wmcNotice).catch(noop);
            break;
        } catch (cause) {
            if (tries == 2) throw new Error('Failed to login to WDS', { cause });
            await page.waitForTimeout(5000);
            console.error('Failed to login to WDS, retrying...', cause);
            await page.reload();
        }
    }
}
