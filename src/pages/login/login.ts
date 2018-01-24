import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login() {
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
