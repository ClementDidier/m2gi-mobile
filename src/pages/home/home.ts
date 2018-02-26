import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { LoggerProvider } from '../../providers/logger/logger';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController, private logger: LoggerProvider) {
        // something
    }

    private ionViewDidLoad() {
        console.log('ionViewDidLoad ListPage');
        if (!this.logger.isLogged())
            this.navCtrl.setRoot(LoginPage);
    }

    private ionViewWillEnter() {
        if (!this.logger.isLogged())
            this.navCtrl.setRoot(LoginPage);
    }
}
