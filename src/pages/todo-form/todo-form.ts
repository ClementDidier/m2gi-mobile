import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../providers/logger/logger';
import { TodoProvider } from '../../providers/todo/todo';

@Component({
  selector: 'page-todo-form',
  templateUrl: 'todo-form.html',
})
export class TodoFormPage {

	private listUID: string;
	private taskname: string;
	private taskdesc: string;

	constructor(private translate: TranslateService, private logger: LoggerProvider, private totoProvider: TodoProvider, public navCtrl: NavController, public navParams: NavParams, private alert: AlertController) {
		this.listUID = this.navParams.get('uid');
	}

	ionViewDidLoad() {
		// nothing
	}

	addTask(): void {
		if(this.taskname) {
			this.totoProvider.addTodo(this.listUID, this.taskname || "???", false, this.taskdesc || "");
			this.navCtrl.pop();
		}
	}

	returnPrecPage(): void {
		this.navCtrl.pop();
	}
}
