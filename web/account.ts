import { test } from 'fixtures';

type AccountMatcher = (accounts: Account[]) => Account[];

export class AccountQuery {
    private matchers: AccountMatcher[];

    constructor() {
        this.matchers = [];
    }

    match(matcher: AccountMatcher): AccountQuery {
        this.matchers.push(matcher);
        return this;
    }

    findAll(accounts: Account[]): Account[] {
        return this.matchers.reduce((accounts, matcher) => matcher(accounts), accounts);
    }

    findOne(accounts: Account[]): Account | undefined {
        const account = this.findAll(accounts)[0];
        test.fixme(!account, '[NO DATA] No account match the criteria');
        return account;
    }

    get canReadEmail(): AccountQuery {
        return this.match(all => all.filter(a => !!a.emailAccount && (!a.emailAccount.expiresAt || a.emailAccount.expiresAt < new Date())));
    }

    get hasAddresses(): AccountQuery {
        return this.match(all => all.filter(a => !!a.addressCount && a.addressCount > 0));
    }

    get notHasAddresses(): AccountQuery {
        return this.match(all => all.filter(a => a.addressCount === 0));
    }

    get hasOrders(): AccountQuery {
        return this.match(all => all.filter(a => !!a.orderCount && a.orderCount > 0));
    }

    get hasWishlists(): AccountQuery {
        return this.match(all => all.filter(a => !!a.wishlistCount && a.wishlistCount > 0));
    }

    eppRegistered(storeUid: string): AccountQuery {
        return this.match(all => all.filter(a => a.eppRegistered?.some(epp => epp == storeUid) ?? false));
    }

    notEppRegistered(storeUid: string): AccountQuery {
        return this.match(all => all.filter(a => !!a.eppRegistered && !a.eppRegistered.some(s => s == storeUid)));
    }

    nth(index: number): AccountQuery {
        return this.match(all => all[index - 1] ? [all[index - 1]] : []);
    }
}

export default class AccountFinder {
    static get any(): AccountQuery {
        return new AccountQuery();
    }

    static email(email: string): AccountQuery {
        return new AccountQuery().match(all => all.filter(a => a.email == email));
    }
};
