import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as App from '../../config/app';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the SignOutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-sign-out',
  templateUrl: 'sign-out.html',
})
export class SignOutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  performSignOut() {
      this.storage.set(App.STORAGE_APP_HAS_LOGIN, false);

      // go dashboard
      this.navCtrl.setRoot(RegisterPage);
  }

}
