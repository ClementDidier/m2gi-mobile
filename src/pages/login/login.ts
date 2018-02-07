import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import FirebaseGooglePlus from 'firebase';

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: AngularFireAuth, private googlePlus: GooglePlus) {
        FirebaseGooglePlus.auth().onAuthStateChanged(user => {
            if(user) {
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
            'webClientId': '554302347766-p7rm12qcts88kh68c4eleevl29j0i6jc',
            'offline': true
        }).then( res => console.log('GOOD', res))
        .catch(err => console.error('ERROR ! :(', err));
    }

    async loginSample() {
        try {
            const result = await this.firebase.auth.signInWithEmailAndPassword(this.email, this.password);
            if(result) {
                this.navCtrl.setRoot(HomePage);
                console.log("good", result);
            }
        }
        catch(e) {
            console.error(e);
        }
    }
}
