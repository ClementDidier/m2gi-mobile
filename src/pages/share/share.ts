import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../providers/logger/logger';
import { TodoList } from '../../model/todo-list.model';
import { TodoProvider } from '../../providers/todo/todo';

@Component({
    selector: 'page-share',
    templateUrl: 'share.html'
})
export class SharePage {

    private list: TodoList;
    private mailAddress: string;

    constructor(public navCtrl: NavController, public todo: TodoProvider, public alertCtrl: AlertController, public navParams: NavParams, private logger: LoggerProvider, private translate: TranslateService) {
        this.list = this.navParams.get('list');
    }

    private ionViewDidLoad() {
        if (!this.logger.isLogged())
            this.navCtrl.setRoot(LoginPage);
    }

    private ionViewWillEnter() {
        if (!this.logger.isLogged())
            this.navCtrl.setRoot(LoginPage);
    }

    private share(): void {
        if(this.mailAddress && this.list) {
            //this.notify()
            this.todo.getUsersEmail().then((emails) => {
                var users = emails.filter(email => email == this.mailAddress);
                if(users && users.length > 0) {
                    // TODO: Ajout de la liste pour l'autre utilisateur 
                    this.notify(true); // Notifie l'utilisateur que le partage est OK
                } else {
                    this.notify(false); // notifie l'utilisateur que le partage n'est pas OK
                }
            });
        }
    }

    private notify(isSuccess): void {
        this.alertCtrl.create({
            title: this.translate.instant('share-button-caption'),
            message: isSuccess ? this.translate.instant('share-success-modal-content') : this.translate.instant('share-fail-modal-content'),
            buttons: [
                {
                    text: this.translate.instant('valid-button-caption'),
                    role: 'cancel'
                }
            ]
        }).present();
    }

    returnPrecPage(): void {
		this.navCtrl.pop();
	}
}
