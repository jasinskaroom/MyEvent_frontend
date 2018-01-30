import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import * as App from '../config/app';
import { Events } from 'ionic-angular';

import { LoadingPage } from '../pages/loading/loading';

// Menu Page
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ProfilePage } from '../pages/profile/profile';
import { SignOutPage } from '../pages/sign-out/sign-out';

import { AppRate } from '@ionic-native/app-rate';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectionPage } from '../pages/language-selection/language-selection';
import { ImgCacheService } from 'ng-imgcache';
import { Keyboard } from '@ionic-native/keyboard';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage:any = LoadingPage;
    userId: string;
    userDrawId: string;
    profileTabName: string;
    pages: Array<{title: string, component: any}>;
    appFontColor:       string;
    styleClass :        string;
    backPressed: boolean;

    constructor(private keyboard: Keyboard, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private appRate: AppRate, public translate: TranslateService,public storage: Storage, imgCache: ImgCacheService, public events: Events, public menuCtrl: MenuController, public toast: ToastController) {
        this.backPressed = false;

        this.storage.get(App.STORAGE_APP_LANGUAGE).then((code) => {
             if(code)  translate.setDefaultLang(code);
             else translate.setDefaultLang('en');
         })

        this.pages = [
            { title: 'activities', component: DashboardPage },
            { title: 'profile', component: ProfilePage },
            { title: 'rate_us', component: 'AppRatePage' },
            { title: 'change_language', component: LanguageSelectionPage },
            { title: 'logout', component: SignOutPage }
        ];

        platform.ready().then(() => {
                // Okay, so the platform is ready and our plugins are available.
                // Here you can do any higher level native things you might need.
                statusBar.styleDefault();
                // splashScreen.hide();

                this.appRate.preferences = {
                          usesUntilPrompt: 1,
                           customLocale: {
                                title: "Would you mind rating %@?",
                                message: "It won’t take more than a minute and helps to promote our app. Thanks for your support!",
                                cancelButtonLabel: "No, Thanks",
                                laterButtonLabel: "Remind Me Later",
                                rateButtonLabel: "Rate It Now",
                                yesButtonLabel: "Yes!",
                                noButtonLabel: "Not really",
                                appRatePromptTitle: 'Do you like using %@',
                                feedbackPromptTitle: 'Mind giving us some feedback?',
                              },
                          storeAppURL: {
                           ios: App.STORAGE_IOS_APP_ID,
                           android: 'market://details?id='+App.STORAGE_ANDROID_APP_ID,
                           windows: 'ms-windows-store://review/?ProductId='+App.STORAGE_WINDOWS_APP_ID
                          },
                          callbacks: {
                                handleNegativeFeedback: function(){
                                 // window.open('mailto:feedback@example.com','_system');
                                },
                                onRateDialogShow: function(callback){
                                  //callback(1) // cause immediate click on 'Rate Now' button
                                },
                                onButtonClicked: function(buttonIndex){
                                  //console.log("onButtonClicked -> " + buttonIndex);
                                }
                            }
                        };
                 this.setupAppFontColor();
                    imgCache.init({
                        // Pass any options here...
                      });

                this.events.subscribe('fontcolor:change',()=>{

                    this.setupAppFontColor();
                })

                this.events.subscribe('profile:updated', (user) => {
                    this.userId = user.id;
                    this.userDrawId = user.drawId;
                    this.translate.get('profile_id').subscribe(value => {
                        this.profileTabName = value + ' ' + this.userDrawId;
                        this.pages[1]['title'] = this.profileTabName;
                    });
                });

            this.keyboard.onKeyboardShow().subscribe(() => {
                document.body.classList.add('keyboard-is-open');
            });

            this.keyboard.onKeyboardHide().subscribe(() => {
                document.body.classList.remove('keyboard-is-open');
            });

            platform.backButton.subscribe(() => {
                if (menuCtrl.isOpen()) {
                    menuCtrl.close();

                    return;
                }

                if (this.nav.canGoBack()) {
                    this.nav.pop();

                    return;
                }

                let activePage = this.nav.getActive().instance;

                let whitelistPages = [ProfilePage, DashboardPage, LanguageSelectionPage, SignOutPage];

                // if current page is not in whitelistPage
                // then back to DashboardPage first
                if (whitelistPages.indexOf(activePage.constructor) < 0) {
                    this.nav.setRoot(DashboardPage);

                    return;
                }

                if (! this.backPressed) {
                    this.backPressed = true;

                    this.showToast('Press again to exit', 2000);

                    setTimeout(() => this.backPressed = false, 2000);

                    return;
                }

                if (this.backPressed) {
                    platform.exitApp();
                }

                return;
            }, error => {})

            platform.registerBackButtonAction(function (event) {

            }, 100);

        });
    }

    showToast(title, duration) {
        const toast = this.toast.create({
            message: title,
            duration: duration,
            position: 'bottom'
        });

        toast.present();
    }

    openPage(page) {
        if(page.component=='AppRatePage'){
            this.appRate.promptForRating(true);
        }
        else{
        this.nav.setRoot(page.component);
       }
    }

    setupAppFontColor() {
        // set default image
        this.storage.get(App.STORAGE_APP_FONT_COLOR).then((val) => {
            if (val != undefined && val != '' && val != 'null') {
                this.appFontColor = val;
            }
            else {
                this.appFontColor = 'white';
            }
        });

    }




}
