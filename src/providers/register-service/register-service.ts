import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiServiceProvider } from '../api-service/api-service';

/*
  Generated class for the RegisterServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RegisterServiceProvider {

    constructor(public http: Http, public apiService: ApiServiceProvider) {

    }

    getExtraFields() {
        return this.apiService.get('/extra-register-form');
    }

    register(form) {
        return this.apiService.post('/participant-registration', form);
    }

    preRegister(mobileNumber) {
        return this.apiService.post('/participant-preregistration', {mobile_number: mobileNumber});
    }
}
