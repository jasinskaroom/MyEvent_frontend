import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as App from '../../config/app';
import { RegisterServiceProvider } from '../../providers/register-service/register-service';
import { AlertController, LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Events } from 'ionic-angular';
import { Device } from '@ionic-native/device';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

    recentUser: any;
    eventLogo: string;
    extraFields: [{id:string, name:string}];
    oldEventId:string;

    form: any
    selectedGender: string;

    constructor(private device: Device,public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public registerService: RegisterServiceProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public eventService: EventServiceProvider, public events:Events, public apiServiceProvider:ApiServiceProvider) {
        this.form = {};

        this.setupEventLogo();
        this.setupExtraFields();
        this.getRecentUser();
        this.setupOldEventId();

        this.form.device_id = this.device.uuid;
    }

    setupEventLogo() {
        // set default image
        this.storage.get(App.STORAGE_APP_EVENT_LOGO).then((val) => {
            this.eventLogo = val;
        });
    }

    setupExtraFields() {
        this.registerService.getExtraFields().then((data:any) => {
            if (data.success) {
                this.extraFields = data.content;
            }
        });
    }

    setupOldEventId(){
        this.storage.get(App.STORAGE_OLD_EVENT_ID).then((val) => {
            this.oldEventId = val;
            this.form.old_event_id = val;
        });
    }

    getRecentUser() {
        this.storage.get(App.STORAGE_APP_USER).then(user => {
            this.recentUser = user;
            if (user != undefined && user != null) {
                this.loadParticipantScore();
            }
        });
    }

    loadParticipantScore() {
        this.eventService.getParticipantScore(this.recentUser.api_token)
            .then((data:any) => {
                if (data.success) {
                    this.recentUser.score = data.content.score;
                }
            });
    }

    saveLoginUser(user) {
        this.storage.set(App.STORAGE_APP_USER, user);
        this.storage.set(App.STORAGE_APP_HAS_LOGIN, true);
        this.storage.set(App.STORAGE_APP_HAS_REDEEM, false); // reset
        this.storage.set(App.STORAGE_OLD_EVENT_ID,user.event_id);
        this.apiServiceProvider.apiToken = user.api_token;

        // go dashboard
        this.navCtrl.setRoot(DashboardPage);
    }

    registerUser() {
        let loading = this.loadingCtrl.create({
            content: 'Registering. Please wait...'
        });
        loading.present();
        this.registerService.register(this.form).then((data:any) => {
            loading.dismiss();

            if(data.success){
               this.saveLoginUser(data.content);
            }
            else{
               this.showAlertMessage(data.message);
            }
        });
    }

    preRegisterUser(mobileNumber) {
        let loading = this.loadingCtrl.create({
            content: 'Registering. Please wait...'
        });
        loading.present();
        this.registerService.preRegister(mobileNumber).then((data:any) => {
            loading.dismiss();

            if (data.success) {
                this.saveLoginUser(data.content);
            }
            else {
                this.showAlertMessage(data.message);
            }
        }).catch((error)=>{loading.dismiss()});
    }

    canSubmit() {

        if (this.form.event_id == undefined || this.form.event_id == ''  ){
            this.showAlertMessage('Event Id is required');
        }
        if (this.form.name == undefined || this.form.name == '') {
            this.showAlertMessage('Name is required');
            return false;
        }
        else if (this.form.identity_passport == undefined || this.form.identity_passport == '') {
            this.showAlertMessage('IC / Passport is required');
            return false;
        }
        else if (this.form.email == undefined || this.form.email == '') {
            this.showAlertMessage('Email is required');
            return false;
        }
        else if (!this.validateEmail(this.form.email)) {
            this.showAlertMessage('Email is not valid');
            return false;
        }
        else if (this.form.mobile_number == undefined || this.form.mobile_number == '') {
            this.showAlertMessage('Mobile number is required');
            return false;
        }
        else if (this.form.gender == undefined || this.form.gender == '') {
            this.showAlertMessage('Mobile number is required');
            return false;
        }


        else{
            return true;
        }


    }

    selectGender(gender) {
        this.selectedGender = gender;
        this.form.gender = gender;
    }

    onPreRegistration() {
        let alert = this.alertCtrl.create({
            title: 'Pre-Registration',
            message: 'We will verify if you are valid as pre-registered user',
            inputs: [
                {
                    name: 'mobile_number',
                    placeholder: 'Mobile Number',
                    type: 'number'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Confirm',
                    handler: data => {
                        this.preRegisterUser(data.mobile_number);
                    }
                }
            ]
        });
        alert.present();
    }

    onSubmitForm() {
        // Check if all compulsory selection is selected
        if (this.canSubmit()) {
            this.registerUser();
        }
    }

    extraFieldInputChange(value, fieldId) {
        this.form[fieldId] = value;
    }

    showGenderSelection() {
        let alert = this.alertCtrl.create({
            title: 'Choose Gender',
            message: '',
            buttons: [
                {
                    text: 'Male',
                    handler: () => {
                        this.selectGender('male');
                    }
                },
                {
                    text: 'Female',
                    handler: () => {
                        this.selectGender('female')
                    }
                }
            ]
        });

        alert.present();
    }

    showAlertMessage(message) {
        let alert = this.alertCtrl.create({
            title: 'Notice',
            message: message,
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel'
                }
            ]
        });

        alert.present();
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}
