import type { Locator, Page } from 'playwright';

export interface FormField extends Locator {
    readonly label: Locator;
    readonly errorMessage: Locator;
    readonly clearBtn: Locator;
    readonly select: (option: string | number) => Promise<void>;
}

export interface Checkbox extends Locator {
    readonly label: Locator;
}

export default class Form {
    readonly page: Page;
    readonly fields: FormField;
    readonly invalidFields: FormField;

    constructor(readonly form: Locator) {
        this.page = form.page();
        this.fields = this.formField(this.form.locator('mat-form-field:visible'));
        this.invalidFields = this.formField(this.form.locator('.mat-form-field-invalid:visible'));
    }

    checkbox(name: string): Checkbox {
        const locator = this.form.locator(`
            mat-checkbox[formcontrolname="${name}"]:visible,
            mat-checkbox:has([name="${name}"]):visible
        `);
        return Object.assign(
            locator.getByRole('checkbox'), {
            label: locator.locator('label')
        });
    }

    formField(locator: Locator) {
        return Object.assign(locator, {
            input: locator.locator('input, textarea'),
            label: locator.locator('label'),
            errorMessage: locator.locator('mat-error:visible'),
            clearBtn: locator.locator('.clear-btn'),
            async fill(value: string) {
                try {
                    await locator.locator('input, textarea').fill(value);
                } catch {
                    throw new Error(`unable to fill value ${value} for ${locator}`);
                }
            },
            async select(option: string | number) {
                try {
                    await locator.getByRole('combobox').click({ timeout: 10000, force: true });
                    const opt = typeof option === 'number'
                        ? locator.page().getByRole('option').nth(option - 1)
                        : locator.page().getByRole('option', { name: option }).first();
                    await opt.click({ timeout: 10000 });
                    await opt.waitFor({ state: 'hidden', timeout: 10000 });
                } catch {
                    throw new Error(`unable to select option ${option} for ${locator}`);
                }
            }
        });
    }

    field(name: string) {
        return this.formField(this.form.locator(`
            mat-form-field[formcontrolname="${name}"]:visible,
            mat-form-field:has([name="${name}"]):visible
        `));
    }

    async leaveAllEmpty() {
        for (const field of await this.form.getByRole('textbox').all()) {
            await field.clear();
            await field.blur();
        }
        for (const field of await this.form.getByRole('combobox').all()) {
            await field.click({ force: true });
            await this.page.waitForTimeout(1000);
            await field.click({ force: true, position: { x: -24, y: 0 } });
            await this.page.waitForTimeout(2000);
        }
    }
}
