import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../providers/logger/logger';
import { TodoProvider } from '../../providers/todo/todo';

@Component({
  selector: 'page-list-form',
  templateUrl: 'list-form.html',
})
export class ListFormPage {

	private listname: string;

	constructor(private translate: TranslateService, private logger: LoggerProvider, private totoProvider: TodoProvider, public navCtrl: NavController, public navParams: NavParams, private alert: AlertController) {
	}

	ionViewDidLoad() {
		// nothing
	}

	addList(): void {
		if(this.listname) {
			this.totoProvider.addList(this.listname, this.logger.getUserId());
			this.navCtrl.pop();
		}
	}
}
