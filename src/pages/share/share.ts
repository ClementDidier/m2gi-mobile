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
    private users: any;

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

    private share(user): void {
        this.todo.addListUUIDToUser(user.id, this.list.uuid);
        this.notify(true); // Notifie l'utilisateur que le partage est OK
    }

    private onInput(event) : void {
        var myEmail;
        this.todo.getUsers().then((users) => {
            var reg = new RegExp(this.mailAddress);
            var usr = [];
            users.forEach(u => {
                if(reg.test(u.email) && this.logger.email !== u.email)
                    usr.push(u);
            });
            this.users = usr;
        });
    }

    private notify(isSuccess): void {
        this.alertCtrl.create({
            title: this.translate.instant('share-button-caption'),
            message: isSuccess ? this.translate.instant('share-success-modal-content') : this.translate.instant('share-fail-modal-content'),
            buttons: [
                {
                    text: this.translate.instant('valid-button-caption'),
                    handler: () => { this.navCtrl.pop(); }
                }
            ]
        }).present();
    }

    returnPrecPage(): void {
		this.navCtrl.pop();
	}
}
