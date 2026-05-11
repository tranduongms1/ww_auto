import { test, expect } from 'fixtures';
import product from 'product';

const title = 'AEM Estore - Add products from PF page';
const tag = ['@Core'];

test.use({ site: 'MY' });
test.use({ product: product.any.hasPF.canBuy });

test(title, { tag }, async ({ context, page, pf, cart, capture }) => {
    const product = context.product!;

    // 1. Access to PF page and click on Add to cart button
    await page.goto(product.pfURL!);
    const productCard = pf.productCard(product.name!);
    await capture('PF', productCard.card);
    await productCard.buyNowBtn.click();

    // 2. Verify User is able to add product to cart page
    await expect(page).navigatedTo(context.cartURL);
    await cart.waitForLoad();
    await expect(cart).containSKU(product.sku);
    await capture('Cart', cart.main);
});
