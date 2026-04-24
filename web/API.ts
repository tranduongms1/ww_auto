import type { Page } from 'fixtures';

export default class API {
    constructor(private page: Page) {
    }

    async getCurrentUserInfo(): Promise<any> {
        try {
            const endpoint = this.page.context().apiEndpoint();
            return this.page.evaluate(async ({ endpoint }) => {
                const curr = JSON.parse(window.localStorage[`spartacus⚿⚿currency`] || '""');
                const lang = JSON.parse(window.localStorage[`spartacus⚿⚿language`] || '""');
                const res = await fetch(`${endpoint}/users/current?lang=${lang}&curr=${curr}`, {
                    headers: { 'accept': 'application/json' },
                    credentials: "include"
                });
                if (!res.ok) {
                    throw `Status code: ${res.status}`;
                }
                return res.json();
            }, { endpoint });
        } catch (e: any) {
            throw new Error(`Unable to get current user info: ${e.message?.replace('page.evaluate: ', '')}`);
        }
    }

    async getCurrentCartInfo(fields = 'FULL'): Promise<CartInfo> {
        try {
            const endpoint = this.page.context().apiEndpoint();
            return this.page.evaluate(async ({ endpoint, fields }) => {
                const curr = JSON.parse(window.localStorage[`spartacus⚿⚿currency`] || '""');
                const lang = JSON.parse(window.localStorage[`spartacus⚿⚿language`] || '""');
                const res = await fetch(`${endpoint}/users/current/carts/current?fields=${fields}&lang=${lang}&curr=${curr}`, {
                    headers: { 'accept': 'application/json' },
                    credentials: "include"
                });
                if (!res.ok) {
                    throw `Status code: ${res.status}`;
                }
                return await res.json();
            }, { endpoint, fields });
        } catch (e: any) {
            throw new Error(`Unable to get current cart info: ${e.message?.replace('page.evaluate: ', '')}`);
        }
    }

    async addToCart(sku: string, quantity: number = 1) {
        try {
            const endpoint = this.page.context().apiEndpoint();
            await this.page.evaluate(async ({ endpoint, sku, quantity }) => {
                const res = await fetch(
                    `${endpoint}/users/current/carts/current/entries`,
                    {
                        method: 'post',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({
                            product: { code: sku },
                            quantity
                        }),
                        credentials: 'include',
                    },
                );
                if (!res.ok) {
                    const json = await res.json().catch(() => null);
                    throw json?.errors[0]?.message || `Status code: ${res.status}`;
                }
            }, { endpoint, sku, quantity });
            if (quantity && quantity > 1) {
                console.log(`${quantity} products ${sku} added to cart`);
            } else {
                console.log(`Product ${sku} added to cart`);
            }
        } catch (e: any) {
            throw new Error(`Unable to add ${sku} to cart: ${e.message?.replace('page.evaluate: ', '')}`);
        }
    }

    async addToCartMulti(sku: string, childSKU: string, quantity = 1) {
        try {
            const endpoint = this.page.context().apiEndpoint();
            const data = [{
                productCode: sku,
                qty: quantity,
                childProducts: [{ product: { code: childSKU }, quantity: 1 }],
            }];
            await this.page.evaluate(async ({ endpoint, data }) => {
                const res = await fetch(`${endpoint}/addToCart/multi/?fields=BASIC`, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include'
                });
                if (!res.ok) {
                    const json = await res.json().catch(() => null);
                    throw json?.errors[0]?.message || `Status code: ${res.status}`;
                }
            }, { endpoint, data });
        } catch (e: any) {
            throw new Error(`Unable to add ${sku} with child product ${childSKU} to cart: ${e.message?.replace('page.evaluate: ', '')}`);
        }
    }

    async addServiceToCart(entryNumber: number, data: Record<string, any>) {
        const endpoint = this.page.context().apiEndpoint();
        const storeID = this.page.context().storeID();
        await this.page.evaluate(async ({ endpoint, storeID, entryNumber, data }) => {
            const cardID = window.sessionStorage.ref || JSON.parse(window.localStorage[`spartacus⚿${storeID}⚿cart`]).active;
            const curr = JSON.parse(window.localStorage[`spartacus⚿⚿currency`]);
            const lang = JSON.parse(window.localStorage[`spartacus⚿⚿language`]);
            const res = await fetch(
                `${endpoint}/users/current/carts/${cardID}/entries/${entryNumber}/services?lang=${lang}&curr=${curr}`,
                {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include',
                }
            );
            if (!res.ok) {
                throw `Status code: ${res.status}`;
            }
        }, { endpoint, storeID, entryNumber, data });
    }
}
