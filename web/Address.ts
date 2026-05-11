import { Locator } from 'playwright';
import Form from './Form';

export default class Address extends Form {
    constructor(form: Locator) {
        super(form);
    }

    get firstName() {
        return this.field('firstName');
    }

    get lastName() {
        return this.field('lastName');
    }

    get phoneCode() {
        return this.field('phoneCode');
    }

    get phoneNumber() {
        return this.field('phoneNumber');
    }

    get country() {
        return this.field('country');
    }

    get searchAddress() {
        return this.field('searchAddress');
    }

    get postalCode() {
        return this.field('postalCode');
    }

    get line1() {
        return this.field('line1');
    }

    get line2() {
        return this.field('line2');
    }

    get state() {
        return this.field('state');
    }

    get province() {
        return this.field('province');
    }

    get region() {
        return this.field('region');
    }

    get city() {
        return this.field('city');
    }

    get town() {
        return this.field('town');
    }

    get district() {
        return this.field('district');
    }
}
