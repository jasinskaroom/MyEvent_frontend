import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { Storage } from '@ionic/storage';
import * as App from '../../config/app';
import { NoEventPage } from '../no-event/no-event';
import { LanguageSelectionPage } from '../language-selection/language-selection';
import { RegisterPage } from '../register/register';
import { DashboardPage } from '../dashboard/dashboard';

import { Events } from 'ionic-angular';


/**
 * Generated class for the LoadingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
  providers: [ConfigServiceProvider]
})
export class LoadingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public configService: ConfigServiceProvider, public storage: Storage,public events:Events) {

  }

  ionViewDidLoad() {
      // Setup app config
      this.setupConfig();
  }

  setupConfig() {
      this.configService.loadConfig()
      .then(data => {
          var hasEvent = data['has_event'];
          if (hasEvent) {
              this.saveAppConfig(data).then(() => {
                  this.showNextPage();
              });
          }
          else {
              // Exit app
              this.showNoEventPage();
          }
      });
  }

  saveAppConfig(data) {
      var config = {};
      config[App.STORAGE_APP_BACKGROUND] = data['background_url'];
      config[App.STORAGE_APP_FONT_COLOR] = data['font_color'];
      config[App.STORAGE_APP_EVENT_LOGO] =  data['event_logo'];


      var promise = [];
      for (var key in config) {
          if (config.hasOwnProperty(key)) {
              var storePromise = this.storage.set(key, config[key]);
              promise.push(storePromise);
          }
      }

      
      this.events.publish('fontcolor:change');
      return Promise.all(promise);
  }

  showNextPage() {
      this.getNeededConfig().then((data) => {
          // Language not selected
         if (data[App.STORAGE_APP_LANGUAGE] == null) {
            this.navCtrl.setRoot(LanguageSelectionPage);
         }
         // User not yet login
         else if (data[App.STORAGE_APP_HAS_LOGIN] == null || data[App.STORAGE_APP_HAS_LOGIN] == false){
             this.navCtrl.setRoot(RegisterPage);
         }
         // Dashboard
         else {
             this.navCtrl.setRoot(DashboardPage);
         }
      });
  }

  showNoEventPage() {
      this.navCtrl.setRoot(NoEventPage)
  }

  getNeededConfig() {
      var config = [
          App.STORAGE_APP_LANGUAGE,
          App.STORAGE_APP_HAS_LOGIN
      ];
 
      var promise = [];
      config.forEach((val) => {
         promise.push(this.storage.get(val));
      });

      return Promise.all(promise).then(values => {
          const result = [];

          values.map( (value, index) => {
             result[config[index]] = value;
          });

          return result;
      });
  }

}
