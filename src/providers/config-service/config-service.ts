import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as App from '../../config/app';

/*
  Generated class for the ConfigServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConfigServiceProvider {

  constructor(public http: Http) {

  }

  loadConfig() {
      return new Promise(resolve => {

         this.http.get(App.API_ENDPOINT + '/config')
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            });
      });
  }

}
