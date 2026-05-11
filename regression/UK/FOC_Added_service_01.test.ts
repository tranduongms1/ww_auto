import { test, expect } from 'fixtures';

const title = 'Should not be Able to add Trade-in on FOC item V2';
const tag = ['@Core'];

test.use({ site: 'UK' });

test(title, { tag }, async ({ context, page, cart }) => {

});
