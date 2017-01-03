/**
 * Created by Ed on 02/01/2017.
 */

var Errors  = require('./errors');
var axios   = require('axios');
var _       = require('lodash');

module.exports = class {

    constructor(data) {

        this.resetStages();

        this.originalData   = data;

        for (let field in this.originalData) {

            this[field] = data[field];
        }

        this.errors     = new Errors();

        this.http       = axios.create({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': Laravel.csrfToken
            }
        });
    }

    data() {

        let data   = Object.assign({}, this);

        delete data.originalData;
        delete data.errors;
        delete data.submitting;
        delete data.http;

        return data;
    }

    reset() {

        for (let field in this.originalData) {

            this[field] = '';
        }

        this.errors.clear();
    }

    resetStages() {
        this.submitting     = false;
        this.submitted      = false;
        this.succeeded      = false;
        this.failed         = false;
    }

    post(url, permanentData) {
        return this.submit('post', url, permanentData);
    }

    put(url, permanentData) {
        return this.submit('put', url, permanentData);
    }

    delete(url, permanentData) {
        return this.submit('delete', url, permanentData);
    }

    submit(method, url, permanentData) {
        this.resetStages();

        this.submitting = true;

        return new Promise((resolve, reject) => {

            var data    = _.extend(this.data(), permanentData);

            this.http[method](url, data)
                .then(response => {
                    this.onSuccess(response.data);
                    resolve(response.data);
                    this.submitting     = false;
                })
                .catch(error => {
                    this.onError(error.response.data);
                    reject(error.response.data);
                    this.submitting     = false;
                });
        });
    }

    onSuccess(data) {
        this.succeeded  = true;
        this.submitted  = true;
        this.reset();
    }

    onError(errors) {
        this.failed     = true;
        this.submitted  = true;
        this.errors.record(errors);
    }
}