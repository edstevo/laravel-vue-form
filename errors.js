/**
 * Created by Ed on 02/01/2017.
 */
module.exports = class {

    constructor() {
        this.errors = {};
    }

    get(field) {

        if (this.errors[field]) {

            return this.errors[field][0];
        }
    }

    any() {
        return (Object.keys(this.errors).length > 0);
    }

    has (field) {
        return this.errors.hasOwnProperty(field);
    }

    record(errors) {
        this.errors     = errors;
    }

    clear(field) {

        if (field) {
            delete this.errors[field];

            return;
        }

        this.errors = {};
    }
};