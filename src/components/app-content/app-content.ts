import { Component, ViewEncapsulation } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as App from '../../config/app';

/**
 * Generated class for the AppContentComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-content',
  templateUrl: 'app-content.html',
  encapsulation: ViewEncapsulation.None
})
export class AppContentComponent {

    appBackgroundImage: string;

    constructor(public storage: Storage) {
        // Setup app background image
        this.setupAppBackgroundImage();  
    }

    setupAppBackgroundImage() {
        // set default image
        this.appBackgroundImage = '../../assets/images/splash.png';

        this.storage.get(App.STORAGE_APP_BACKGROUND).then((val) => {
            if (val != undefined && val != '' && val != 'null') {
                  this.appBackgroundImage = val;
            }
            else {
                this.appBackgroundImage = '../../assets/images/default_app_background.jpg'
            }
        });


    }

 

}
