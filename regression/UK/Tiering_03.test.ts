import { test, expect } from 'fixtures';
import account from 'account';

const title = 'Reward Tiering - Mypage';
const tag = ['@Tier2'];

test.use({ site: 'UK' });
test.use({ account: account.reward });

test(title, { tag }, async ({ context, page, cart }) => {
    const account = context.account!;

    await page.goto(context.homeURL);
    
    await page.goto(context.myPageURL);
});
