import { test } from 'fixtures';

type ProductMatcher = (products: Product[]) => Product[];

export class ProductQuery {
    private matchers: ProductMatcher[];

    constructor() {
        this.matchers = [];
    }

    match(matcher: ProductMatcher): ProductQuery {
        this.matchers.push(matcher);
        return this;
    }

    findAll(products: Product[]): Product[] {
        return this.matchers.reduce((products, matcher) => matcher(products), products);
    }

    findOne(products: Product[]): Product | undefined {
        const product = this.findAll(products)[0];
        test.fixme(!product, '[NO DATA] No product match the criteria');
        return product;
    }

    get IM(): ProductQuery {
        return this.match(all => all.filter(p => p.type == 'IM'));
    }

    get CE(): ProductQuery {
        return this.match(all => all.filter(p => p.type == 'CE'));
    }

    get HA(): ProductQuery {
        return this.match(all => all.filter(p => p.type == 'HA'));
    }

    get hasBC(): ProductQuery {
        return this.match(all => all.filter(p => p.bcURL));
    }

    get hasPD(): ProductQuery {
        return this.match(all => all.filter(p => p.pdURL));
    }

    get hasPF(): ProductQuery {
        return this.match(all => all.filter(p => p.pfURL));
    }

    get hasAddOn(): ProductQuery {
        return this.match(all => all.filter(p => p.addOn));
    }

    get preOrder(): ProductQuery {
        return this.match(all => all.filter(p => p.preOrder));
    }

    get backOrder(): ProductQuery {
        return this.match(all => all.filter(p => p.backOrder));
    }

    get outOfStock(): ProductQuery {
        return this.match(all => all.filter(p => p.outOfStock));
    }

    get tradeIn(): ProductQuery {
        return this.match(all => all.filter(p => p.tradeIn));
    }

    get tradeUp(): ProductQuery {
        return this.match(all => all.filter(p => p.tradeUp));
    }

    get scp(): ProductQuery {
        return this.match(all => all.filter(p => p.scp));
    }

    get stdSCP(): ProductQuery {
        return this.match(all => all.filter(p => p.stdSCP));
    }

    get subSCP(): ProductQuery {
        return this.match(all => all.filter(p => p.subSCP));
    }

    get sim(): ProductQuery {
        return this.match(all => all.filter(p => p.sim));
    }

    get flex(): ProductQuery {
        return this.match(all => all.filter(p => p.flex));
    }

    get flexUpgrade(): ProductQuery {
        return this.match(all => all.filter(p => p.flexUpgrade));
    }

    get galaxyClub(): ProductQuery {
        return this.match(all => all.filter(p => p.galaxyClub));
    }

    get warranty(): ProductQuery {
        return this.match(all => all.filter(p => p.warranty));
    }

    get canBuy(): ProductQuery {
        return this.match(all => [
            ...all.filter(p => p.canBuy),
            ...all.filter(p => p.canBuy === false)
        ]);
    }

    nth(index: number): ProductQuery {
        return this.match(all => all[index - 1] ? [all[index - 1]] : []);
    }
}

export default class ProductFinder {
    static get any(): ProductQuery {
        return new ProductQuery();
    }

    static sku(sku: string): ProductQuery {
        return new ProductQuery().match(all => all.filter(p => p.sku == sku));
    }
}
