import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiServiceProvider } from '../api-service/api-service';

/*
  Generated class for the ProfileServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ProfileServiceProvider {

  constructor(public http: Http, public apiService: ApiServiceProvider) {
  }

  getProfile() {
      return this.apiService.get('/profile/get');
  }

  updateProfile(form) {
      return this.apiService.post('/profile/update', form);
  }
}
