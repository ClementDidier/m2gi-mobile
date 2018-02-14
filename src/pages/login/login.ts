import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import * as firebase from 'firebase/app';
import { FIREBASE_CREDENTIALS } from '../../firebase.credentials';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
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
    private userProfile: Observable<firebase.User>;

    constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService, private firebase: AngularFireAuth, private googlePlus: GooglePlus, private alert: AlertController) {
        this.userProfile = firebase.authState;
    }

    public ionViewDidLoad(): void {
        console.log('ionViewDidLoad LoginPage');
    }

    public loginGooglePlus(): void {
        this.googlePlus.login({
            webClientId: FIREBASE_CREDENTIALS.webClientId,
            offline: true
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

    public loginSample(): void {
        this.firebase.auth.signInWithEmailAndPassword(this.email, this.password).then((result) => {
            // si connection réalisée avec succés
            if (result) {
                this.alert.create({
                    title: 'Connection',
                    subTitle: this.translate.instant('sample-connexion-success-message'),
                    buttons: ['Have fun']
                }).present();
                this.navCtrl.setRoot(HomePage);
            }
        }).catch((error) => {
            this.alert.create({
                title: 'Erreur de connection',
                subTitle: this.translate.instant('sample-connexion-failed-message') + '\nMessage : ' + error,
                buttons: ['OK']
            }).present();
        });
    }
}
