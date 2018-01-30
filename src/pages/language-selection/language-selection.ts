import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as App from '../../config/app';
import { AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { DashboardPage } from '../dashboard/dashboard';
import { TranslateService } from '@ngx-translate/core';
import {ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the LanguageSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-language-selection',
  templateUrl: 'language-selection.html',
})
export class LanguageSelectionPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public translateService: TranslateService,public apiServiceProvider: ApiServiceProvider) {

    }

    onSelectLanguage(code) {
        // Prompt user to confirm the selection
        let alert = this.alertCtrl.create({
            title: 'Confirm Language',
            message: 'You able to make changes on app settings later on.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Confirm (' + code.toUpperCase() + ')',
                    handler: () => {
                        this.saveUserPreferredLanguage(code);
                    }
                }
            ]
        });

        alert.present();
    }

    saveUserPreferredLanguage(code) {
        this.translateService.use(code);
        this.apiServiceProvider.locale = code;
        this.storage.set(App.STORAGE_APP_LANGUAGE, code).then(() => {

            this.goToNextPage();
        });
    }

    goToNextPage() {
        this.storage.get(App.STORAGE_APP_HAS_LOGIN).then(val => {
            // send user to dashboard
            if (val != null && val == true) {
                this.navCtrl.setRoot(DashboardPage);
            }
            // sent user to register
            else {
                this.navCtrl.setRoot(RegisterPage);
            }
        });
    }
}
