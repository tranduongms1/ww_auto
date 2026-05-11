import { test } from 'fixtures';

export type Product = {
    sku: string;
    name?: string;
    type?: 'IM' | 'CE' | 'HA' | 'Ring';
    bcURL?: string;
    pdURL?: string;
    pfURL?: string;
    hasAddOn?: boolean;
    hasMBO?: boolean;
    bespokeSKU?: string;
    preOrder?: boolean;
    backOrder?: boolean;
    outOfStock?: boolean;
    reservation?: boolean;
    vip?: boolean;
    tradeIn?: boolean;
    tradeUp?: boolean;
    scp?: boolean;
    stdSCP?: boolean;
    subSCP?: boolean;
    daSub?: boolean;
    sim?: boolean;
    flex?: boolean;
    flexUpgrade?: boolean;
    galaxyClub?: boolean;
    knox?: boolean;
    warranty?: boolean;
    canBuy?: boolean;
    deliveryOptions?: string[];
}

type ProductMatcher = (products: Product[]) => Product[] | Promise<Product[]>;

export class ProductQuery {
    private matchers: ProductMatcher[];
    private criteria: Set<string>;

    constructor() {
        this.matchers = [];
        this.criteria = new Set();
    }

    match(criteria: string, matcher: ProductMatcher): ProductQuery {
        this.criteria.add(criteria);
        this.matchers.push(matcher);
        return this;
    }

    async findAll(products: Product[]): Promise<Product[]> {
        let result = products;
        for (const matcher of this.matchers) {
            result = await matcher(result);
        }
        return result;
    }

    async findOne(products: Product[]): Promise<Product | undefined> {
        const result = await this.findAll(products);
        const message = `[NO DATA] No product match the criteria: ${[...this.criteria].join(', ')}`;
        !result.length && console.error(message);
        test.fixme(!result.length, message);
        return result[0];
    }

    get IM(): ProductQuery {
        return this.match('IM', all => all.filter(p => p.type == 'IM'));
    }

    get CE(): ProductQuery {
        return this.match('CE', all => all.filter(p => p.type == 'CE'));
    }

    get HA(): ProductQuery {
        return this.match('HA', all => all.filter(p => p.type == 'HA'));
    }

    get Ring(): ProductQuery {
        return this.match('Ring', all => all.filter(p => p.type == 'Ring'));
    }

    get hasBC(): ProductQuery {
        return this.match('has BC', all => all.filter(p => p.bcURL));
    }

    get hasPD(): ProductQuery {
        return this.match('has PD', all => all.filter(p => p.pdURL));
    }

    get hasPF(): ProductQuery {
        return this.match('has PF', all => all.filter(p => p.pfURL));
    }

    get hasAddOn(): ProductQuery {
        return this.match('has Add-on', all => all.filter(p => p.hasAddOn));
    }

    get hasMBO(): ProductQuery {
        return this.match('has MBO', all => all.filter(p => p.hasMBO));
    }

    get bespoke(): ProductQuery {
        return this.match('bespoke', all => all.filter(p => p.bespokeSKU));
    }

    get preOrder(): ProductQuery {
        return this.match('pre-order', all => all.filter(p => p.preOrder));
    }

    get backOrder(): ProductQuery {
        return this.match('back order', all => all.filter(p => p.backOrder));
    }

    get outOfStock(): ProductQuery {
        return this.match('out of stock', all => all.filter(p => p.outOfStock));
    }

    get tradeIn(): ProductQuery {
        return this.match('Trade-in', all => all.filter(p => p.tradeIn));
    }

    get tradeUp(): ProductQuery {
        return this.match('Trade-up', all => all.filter(p => p.tradeUp));
    }

    get scp(): ProductQuery {
        return this.match('SC+', all => all.filter(p => p.scp));
    }

    get stdSCP(): ProductQuery {
        return this.match('Standard SC+', all => all.filter(p => p.stdSCP));
    }

    get subSCP(): ProductQuery {
        return this.match('Sub SC+', all => all.filter(p => p.subSCP));
    }

    get noSCP(): ProductQuery {
        return this.match('No SC+', all => all.filter(p => p.scp != true));
    }

    get daSub(): ProductQuery {
        return this.match('DA Subscription', all => all.filter(p => p.daSub));
    }

    get sim(): ProductQuery {
        return this.match('SIM', all => all.filter(p => p.sim));
    }

    get noSIM(): ProductQuery {
        return this.match('No SIM', all => all.filter(p => p.sim != true));
    }

    get flex(): ProductQuery {
        return this.match('Flex', all => all.filter(p => p.flex));
    }

    get flexUpgrade(): ProductQuery {
        return this.match('Flex Upgrade', all => all.filter(p => p.flexUpgrade));
    }

    get galaxyClub(): ProductQuery {
        return this.match('Galaxy Club', all => all.filter(p => p.galaxyClub));
    }

    get knox(): ProductQuery {
        return this.match('Knox', all => all.filter(p => p.knox));
    }

    get warranty(): ProductQuery {
        return this.match('Warranty', all => all.filter(p => p.warranty));
    }

    get canBuy(): ProductQuery {
        return this.match('can buy', all => [
            ...all.filter(p => p.canBuy),
            ...all.filter(p => p.canBuy === false)
        ]);
    }

    hasDeliveryOption(option: string): ProductQuery {
        return this.match(`has delivery option ${option}`, all => all.filter(p => p.deliveryOptions?.includes(option)));
    }

    nth(index: number): ProductQuery {
        return this.match(`nth ${index}`, all => all[index - 1] ? [all[index - 1]] : []);
    }
}

export default class ProductFinder {
    static get any(): ProductQuery {
        return new ProductQuery();
    }

    static sku(sku: string): ProductQuery {
        return new ProductQuery().match(`sku == ${sku}`, all => all.filter(p => p.sku == sku));
    }

    static get reservation(): ProductQuery {
        return new ProductQuery().match('reservation', all => all.filter(p => p.reservation));
    }

    static get noReservation(): ProductQuery {
        return new ProductQuery().match('No reservation', all => all.filter(p => !p.reservation));
    }

    static get vip(): ProductQuery {
        return new ProductQuery().match('VIP', all => all.filter(p => p.vip));
    }

    static in(skus: string[]): ProductQuery {
        return new ProductQuery().match(`in [${skus.join(', ')}]`, all => all.filter(p => skus.includes(p.sku)));
    }

    static notIn(skus: string[]): ProductQuery {
        return new ProductQuery().match(`not in [${skus.join(', ')}]`, all => all.filter(p => !skus.includes(p.sku)));
    }
}
