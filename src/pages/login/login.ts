import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Select } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../providers/logger/logger';

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

    @ViewChild('sectionSelect') sectionSelect: Select;

    private email: string;
    private password: string;

    public langs: any = [
        'fr',
        'gb'
    ];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private translate: TranslateService,
        private alert: AlertController,
        private logger: LoggerProvider) {

        this.translate.use('fr');
    }

    public ionViewDidLoad(): void {
        console.log('ionViewDidLoad LoginPage');
    }

    public loginGooglePlus(): void {
        this.logger.googleLogIn().then(res => {
            this.alert.create({
                title: 'Connection',
                subTitle: this.translate.instant('googleplus-connexion-success-message'),
                buttons: ['Have fun']
            }).present();
            this.navCtrl.setRoot(HomePage);
        }).catch(err => {
            this.alert.create({
                title: 'Erreur de connection',
                subTitle: this.translate.instant('googleplus-connexion-failed-message') + '\nMessage : ' + err,
                buttons: ['OK']
            }).present();
        });
    }

    public loginSample(): void {
        if(this.email && this.password) {
            this.logger.sampleLogIn(this.email, this.password).then(res => {
                this.alert.create({
                    title: 'Connection',
                    subTitle: this.translate.instant('sample-connexion-success-message'),
                    buttons: ['Have fun']
                }).present();
                this.navCtrl.setRoot(HomePage);
            }).catch(err => {
                this.alert.create({
                    title: 'Erreur de connection',
                    subTitle: this.translate.instant('sample-connexion-failed-message') + '\nMessage : ' + err,
                    buttons: ['OK']
                }).present();
            });
        }
    }

    public logOut(): void {
        this.logger.logOut();
    }

    public getLangs(): string[] {
        let res = this.langs.filter(l => l !== this.translate.currentLang);
        return res;
    }

    public doLangSelection(): void {
        this.sectionSelect.open();
    }

    public onSelectChange(selectedLang: any): void {
        this.translate.use(selectedLang);
    }
}
