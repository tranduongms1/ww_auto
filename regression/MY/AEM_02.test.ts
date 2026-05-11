import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add products from PD page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPD.canBuy });

test(title, { tag }, async ({ context, page, pd, cart, capture }) => {
    const product = context.product!;

    // 1. Access to PD page
    // 2. Inspect to get the product info, Verify SIMPLE INFO API send data to AEM  and compared with the those on BO
    pd.product = product;
    await page.goto(product.pdURL!);

    // 2. API called with correct product info

    // 3. Click on Add to cart button
    await pd.waitForAddToCartButton();
    await capture('PD', pd.addToCartBtn);
    await pd.continueToCart();

    // 3. Able to add product to cart from PD page
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart', cart.main);
});
