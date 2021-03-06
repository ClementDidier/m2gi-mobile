import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../providers/logger/logger';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController,
        private logger: LoggerProvider,
        private translate: TranslateService) {
        // something
    }

    private ionViewDidLoad() {
        if (!this.logger.isLogged())
            this.navCtrl.setRoot(LoginPage);
    }

    private ionViewWillEnter() {
        if (!this.logger.isLogged())
            this.navCtrl.setRoot(LoginPage);
    }
}
