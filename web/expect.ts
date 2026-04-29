import { ExpectMatcherState, MatcherReturnType, Page } from 'playwright/test';

const noneMessage = () => '';

type Options = {
    timeout?: number;
}

export async function navigatedTo(this: ExpectMatcherState, page: Page, url: string, options?: Options): Promise<MatcherReturnType> {
    try {
        const uri = new URL(url);
        await page.waitForURL(({ protocol, host, pathname }) => {
            return protocol == uri.protocol && host == uri.host && pathname.replace(/\/$/, '') == uri.pathname.replace(/\/$/, '')
        }, { timeout: 60000, ...options });
        return { pass: true, message: noneMessage };
    } catch (e: any) {
        return {
            pass: false,
            message: () => this.utils.matcherHint('navigatedTo', 'Page', undefined) + '\n' +
                'Expected: ' + this.utils.printExpected(url) + '\n' +
                'Actual: ' + this.utils.printReceived(page.url())
        };
    }
}
