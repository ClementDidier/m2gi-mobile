import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import FirebaseGooglePlus from 'firebase';
import { AlertController } from 'ionic-angular';

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: AngularFireAuth, private googlePlus: GooglePlus, private alert: AlertController) {
        FirebaseGooglePlus.auth().onAuthStateChanged(user => {
            if(user) {
                this.alert.create({
                    title: 'Connection',
                    subTitle: 'Connecté à GooglePlus',
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
            'webClientId': '554302347766-piur8evatklop98tg3e2nv4bkh50d26d.apps.googleusercontent.com',
            'offline': true
        }).then(res => {
            this.alert.create({
                title: 'Connection',
                subTitle: 'Connecté à GooglePlus',
                buttons: ['Have fun']
            }).present();
        }).catch(err => {
            this.alert.create({
                title: 'Erreur de connection',
                subTitle: 'Une erreur est survenue lors de la tentative de connection.\nMessage : ' + err,
                buttons: ['OK']
            }).present();
        });
    }

    async loginSample() {
        try {
            const result = await this.firebase.auth.signInWithEmailAndPassword(this.email, this.password);
            if(result) {
                this.navCtrl.setRoot(HomePage);
                console.log("good", result);
                this.alert.create({
                    title: 'Connection',
                    subTitle: 'Connecté à l\'application ionic-todo !',
                    buttons: ['Have fun']
                }).present();
            }
        }
        catch(e) {
            this.alert.create({
                title: 'Erreur de connection',
                subTitle: 'Message : ' + e,
                buttons: ['OK']
            }).present();
        }
    }
}
