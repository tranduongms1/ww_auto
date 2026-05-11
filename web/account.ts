import { test } from 'fixtures';

export type Account = {
    email: string;
    password: string;
    addressCount?: number;
    orderCount?: number;
    wishlistCount?: number;
    emailInbox?: {
        url: string;
        email: string;
    };
    hasCredit?: boolean;
    reward?: boolean | {
        level?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | string;
        points?: number;
    };
    eppRegistered?: string[];
    lastLoginAt?: Date;
}

type AccountMatcher = (accounts: Account[]) => Account[];

export class AccountQuery {
    private matchers: AccountMatcher[];
    private criteria: Set<string>;

    constructor() {
        this.matchers = [];
        this.criteria = new Set();
    }

    match(criteria: string, matcher: AccountMatcher): AccountQuery {
        this.criteria.add(criteria);
        this.matchers.push(matcher);
        return this;
    }

    findAll(accounts: Account[]): Account[] {
        return this.matchers.reduce((accounts, matcher) => matcher(accounts), accounts);
    }

    findOne(accounts: Account[]): Account | undefined {
        const account = this.findAll(accounts)[0];
        const message = `[NO DATA] No account match the criteria: ${[...this.criteria].join(', ')}`;
        !account && console.error(message);
        test.fixme(!account, message);
        return account;
    }

    get canReadEmail(): AccountQuery {
        return this.match('can read email', all => all.filter(a => a.emailInbox));
    }

    get hasAddresses(): AccountQuery {
        return this.match('has addresses', all => all.filter(a => !!a.addressCount && a.addressCount > 0));
    }

    get notHasAddresses(): AccountQuery {
        return this.match('no addresses', all => all.filter(a => a.addressCount === 0));
    }

    get hasOrders(): AccountQuery {
        return this.match('has orders', all => all.filter(a => !!a.orderCount && a.orderCount > 0));
    }

    get noOrders(): AccountQuery {
        return this.match('no orders', all => all.filter(a => a.orderCount === 0));
    }

    get hasWishlists(): AccountQuery {
        return this.match('has wishlists', all => all.filter(a => !!a.wishlistCount && a.wishlistCount > 0));
    }

    rewardLevel(level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | string): AccountQuery {
        return this.match(`reward level ${level}`, all => all.filter(a => typeof a.reward === 'object' && a.reward.level === level));
    }

    eppRegistered(storeUid: string): AccountQuery {
        return this.match(`${storeUid} registered`, all => all.filter(a => a.eppRegistered?.some(epp => epp == storeUid) ?? false));
    }

    notEppRegistered(storeUid: string): AccountQuery {
        return this.match(`not ${storeUid} registered`, all => all.filter(a => !!a.eppRegistered && !a.eppRegistered.some(s => s == storeUid)));
    }

    nth(index: number): AccountQuery {
        return this.match(`nth ${index}`, all => all[index - 1] ? [all[index - 1]] : []);
    }
}

export default class AccountFinder {
    static get any(): AccountQuery {
        return new AccountQuery();
    }

    static email(email: string): AccountQuery {
        return new AccountQuery().match(`email == ${email}`, all => all.filter(a => a.email == email));
    }

    static get hasCredit(): AccountQuery {
        return new AccountQuery().match('has credit', all => all.filter(a => a.hasCredit === true));
    }

    static get reward(): AccountQuery {
        return new AccountQuery().match('reward', all => all.filter(a => !!a.reward));
    }

    static notIn(emails: string[]): AccountQuery {
        return new AccountQuery().match(`not in [${emails.join(', ')}]`, all => all.filter(a => !emails.includes(a.email)));
    }
};
