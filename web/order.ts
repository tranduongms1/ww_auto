import { test } from 'fixtures';

type OrderMatcher = (orders: Order[]) => Order[] | Promise<Order[]>;

export class OrderQuery {
    private matchers: OrderMatcher[];
    private criteria: Set<string>;

    constructor() {
        this.matchers = [];
        this.criteria = new Set();
    }

    match(criteria: string, matcher: OrderMatcher): OrderQuery {
        this.criteria.add(criteria);
        this.matchers.push(matcher);
        return this;
    }

    async findAll(orders: Order[]): Promise<Order[]> {
        let result = orders;
        for (const matcher of this.matchers) {
            result = await matcher(result);
        }
        return result;
    }

    async findOne(orders: Order[]): Promise<Order | undefined> {
        const result = await this.findAll(orders);
        const message = `[NO DATA] No order match the criteria: ${[...this.criteria].join(', ')}`;
        !result.length && console.error(message);
        test.fixme(!result.length, message);
        return result[0];
    }

    get notCancelled(): OrderQuery {
        return this.match('not cancelled', all => all.filter(o => o.status != 'Cancelled'));
    }

    nth(index: number): OrderQuery {
        return this.match(`nth ${index}`, all => all[index - 1] ? [all[index - 1]] : []);
    }
}

export default class OrderFinder {
    static get any(): OrderQuery {
        return new OrderQuery();
    }

    static number(number: string): OrderQuery {
        return new OrderQuery().match(`number == ${number}`, all => all.filter(o => o.number == number));
    }

    static get standaloneTradeIn(): OrderQuery {
        return new OrderQuery().match('standalone trade in', all => all.filter(o => o.number[2] == 'S'));
    }

    static get reservation(): OrderQuery {
        return new OrderQuery().match('reservation', all => all.filter(o => o.products.some(p => p.reservation)));
    }
}
