import { test, expect } from 'fixtures';
import product from 'product';

const title = 'Verify guest is able to place order with SC subscription/ DA subscription';
const tag = ['@Core'];

test.use({ site: 'UK' });

for (const { service, paymentMethod, updatePaymentVisible } of [
    {
        sku: 'SM-S938BZDDEUB',
        service: 'SC+ subscription',
        paymentMethod: 'Klarna',
        updatePaymentVisible: true,
    },
    {
        sku: 'SM-S938BZDDEUB',
        service: 'SC+ subscription',
        paymentMethod: 'Credit Card',
        updatePaymentVisible: false,
    },
    {
        sku: 'RA-B23EBB41GM',
        service: 'DA Subscription',
        paymentMethod: 'Klarna',
        updatePaymentVisible: true,
    },
    {
        sku: 'RA-B23EBB41GM',
        service: 'DA Subscription',
        paymentMethod: 'Credit Card',
        updatePaymentVisible: false,
    }
]) {
    test.describe(title, { tag }, () => {
        test.use({ product: service === 'SC+ subscription' ? product.any.subSCP.canBuy : product.any.daSub.canBuy });

        test(`${service} - ${paymentMethod}`, async ({ context, page, cart }) => {
            const product = context.product!;

            await page.goto(context.cartURL);

            await cart.addToCart(product);
            await expect(cart).containSKU(product.sku);
        });
    });
}
