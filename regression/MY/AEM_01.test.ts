import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add products from BC page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasBC.canBuy });

test(title, { tag }, async ({ context, page, bc, cart, capture }) => {
    const product = context.product!;

    // 1. Access to BC page and click on "Buy Now" button
    // 2. Inspect to get the product info, Verify SIMPLE INFO API send data to AEM  and compared with the those on BO
    bc.product = product;
    await page.goto(product.bcURL!);

    // 2. API called with correct product info

    // 3. Continue clicking on Buy Now button in BC page
    await bc.waitForAddToCartButton();
    await capture('BC', bc.addToCartBtn);
    await bc.continueToCart();

    // 4. Verify User is able to add product to cart page
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart', cart.main);
});
