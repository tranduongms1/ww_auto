import type { Page } from 'fixtures';

export default class MyPage {
    constructor(readonly page: Page) {
    }

    get url() {
        return this.page.context().myPageURL;
    }
}
