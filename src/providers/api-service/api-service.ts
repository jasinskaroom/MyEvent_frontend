import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as App from '../../config/app';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {

    locale: string;
    apiToken: string;

    constructor(public http: Http, public storage: Storage) {

    }

    get(urlPath, params = {}) {

        if (this.locale == undefined || this.locale == null ||
            this.apiToken == undefined || this.apiToken == null) {
            return new Promise((resolve,reject) => {
                this.storage.get(App.STORAGE_APP_LANGUAGE).then(val => {
                    this.locale = val;

                    // Check has api token
                    this.storage.get(App.STORAGE_APP_USER).then((data:any) => {
                        let apiToken = data != undefined && data != null ? data.api_token : '';

                        if (apiToken != undefined && apiToken != null && apiToken != '') {
                            this.apiToken = apiToken;
                        }

                        this.requestGet(urlPath, params).then(data => {
                            resolve(data);
                        }).catch(error=>reject(error) );

                    });
                });
            });
        }
        else {
            return this.requestGet(urlPath, params);
        }
    }

    post(urlPath, params) {
        if (this.apiToken == undefined || this.apiToken == null) {
            return new Promise((resolve,reject) => {
                // Check has api token
                this.storage.get(App.STORAGE_APP_USER).then((data:any) => {
                    let apiToken = data != undefined && data != null ? data.api_token : '';

                    if (apiToken != undefined && apiToken != null && apiToken != '') {
                        this.apiToken = apiToken;
                    }

                    this.requestPost(urlPath, params).then(data => {
                        resolve(data);
                    }).catch(error=>reject(error));
                         
                });
            });
        }
        else {
            return this.requestPost(urlPath, params);
        }
    }

    requestGet(urlPath, params) {
        // Construct query string
        var queryString = 'locale=' + this.locale + '&api_token=' + this.apiToken;
        for (var key in params) {
          queryString += key + '=' + encodeURIComponent(params[key]) + '&';
        }

        console.log(App.API_ENDPOINT + urlPath + '?' + queryString);
        return new Promise((resolve,reject) => {
          this.http.get(App.API_ENDPOINT + urlPath + '?' + queryString)
            .map(res => res.json())
            .subscribe(data => {
              resolve(data);
            },
            error=>{
                reject({error:"error"});
            });
        });
    }

    requestPost(urlPath, params) {
        params['api_token'] = this.apiToken;
        console.log(App.API_ENDPOINT + urlPath);

        return new Promise((resolve,reject) => {
          this.http.post(App.API_ENDPOINT + urlPath, params)
            .map(res => res.json())
            .subscribe(data => {
              resolve(data);
            },
            error=>{
                reject({error:"error"});
            });
        });
    }

}
