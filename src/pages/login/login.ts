import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import FirebaseGooglePlus from 'firebase';
import { FirebaseCredentials } from '../../firebase.credentials';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
* Generated class for the LoginPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    private email: string;
    private password: string;
    private userProfile: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService, private firebase: AngularFireAuth, private googlePlus: GooglePlus, private alert: AlertController) {
        FirebaseGooglePlus.auth().onAuthStateChanged(user => {
            if(user) {
                this.alert.create({
                    title: 'Connection',
                    subTitle: translate.instant('googleplus-connexion-success-message'),
                    buttons: ['Have fun']
                }).present();
                this.userProfile = user;
            } else {
                this.userProfile = null;
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    loginGooglePlus(): void {
        this.googlePlus.login({
            'webClientId': FirebaseCredentials.webClientId,
            'offline': true
        }).then(res => {
            this.alert.create({
                title: 'Connection',
                subTitle: this.translate.instant('googleplus-connexion-success-message'),
                buttons: ['Have fun']
            }).present();
        }).catch(err => {
            this.alert.create({
                title: 'Erreur de connection',
                subTitle: this.translate.instant('googleplus-connexion-failed-message') + '\nMessage : ' + err,
                buttons: ['OK']
            }).present();
        });
    }

    async loginSample() {
        try {
            const result = await this.firebase.auth.signInWithEmailAndPassword(this.email, this.password);
            if(result) {
                this.alert.create({
                    title: 'Connection',
                    subTitle: this.translate.instant('sample-connexion-success-message'),
                    buttons: ['Have fun']
                }).present();
                this.navCtrl.setRoot(HomePage);
            }
        }
        catch(e) {
            this.alert.create({
                title: 'Erreur de connection',
                subTitle: this.translate.instant('sample-connexion-failed-message') + '\nMessage : ' + e,
                buttons: ['OK']
            }).present();
        }
    }
}
