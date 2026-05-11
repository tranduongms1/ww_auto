import { Locator } from 'playwright';
import Form from './Form';

export default class CustomerInfo extends Form {
    constructor(form: Locator) {
        super(form);
    }

    get email() {
        return this.field('email');
    }

    get title() {
        return this.field('titleCode');
    }

    get firstName() {
        return this.field('firstName');
    }

    get lastName() {
        return this.field('lastName');
    }

    get fullName() {
        return this.field('fullName');
    }

    get phoneCode() {
        return this.field('phoneCode');
    }

    get phoneNumber() {
        return this.field('phoneNumber');
    }

    get vatNumber() {
        return this.field('vatNumber');
    }

    get taxBranch() {
        return this.field('taxBranch');
    }

    get documentType() {
        return this.field('documentType');
    }

    get documentNumber() {
        return this.field('documentNumber');
    }

    get personalTaxNumber() {
        return this.field('personalTaxNumber');
    }

    get companyId() {
        return this.field('companyId');
    }

    get companyName() {
        return this.field('companyName');
    }

    get companyType() {
        return this.field('companyType');
    }

    get companySize() {
        return this.field('companySize');
    }

    get companyEmail() {
        return this.field('companyEmail');
    }

    get companyPhoneNumber() {
        return this.field('companyPhoneNumber');
    }

    get companyTaxNumber() {
        return this.field('companyTaxNumber');
    }

    get dayOfBirth() {
        return this.field('dayOfBirth');
    }

    get monthOfBirth() {
        return this.field('monthOfBirth');
    }

    get yearOfBirth() {
        return this.field('yearOfBirth');
    }

    get dateOfBirth() {
        return this.field('dateOfBirth');
    }
}
