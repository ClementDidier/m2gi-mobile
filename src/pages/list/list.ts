import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicModule, AlertController } from 'ionic-angular';
import { TodoList } from '../../model/todo-list.model';
import { TodoItem } from '../../model/todo-item.model';
import { LoginPage } from '../login/login';
import { TodoProvider } from '../../providers/todo/todo';
import { LoggerProvider } from '../../providers/logger/logger';
import { TranslateService } from '@ngx-translate/core';

/**
* Generated class for the ListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-list',
    templateUrl: 'list.html',
})
export class ListPage {

    private list: TodoList;

    constructor(public navCtrl: NavController,
         public navParams: NavParams,
         public todoService: TodoProvider,
         private logger: LoggerProvider,
         private alertCtrl: AlertController,
         private translate: TranslateService) {
        var uuid = this.navParams.get('id');
        var name = this.navParams.get('name');

        this.list = {
            uuid: uuid,
            name: name,
            items: []
        };
        this.todoService.getTodos(uuid).subscribe(todoItems => this.list.items = todoItems);
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

    public deleteItem(listid : string, todoid : string) {
        this.confirmItemDeletion(listid, todoid);
    }

    private confirmItemDeletion(listId, todoId) {
        this.alertCtrl.create({
            title: this.translate.instant('removing-confirmation-modal-title'),
            message: this.translate.instant('removing-confirmation-modal-content'),
            buttons: [
                {
                    text: this.translate.instant('cancel-button-caption'),
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: this.translate.instant('valid-button-caption'),
                    handler: () => {
                        this.todoService.deleteTodo(listId, todoId);
                    }
                }
            ]
        }).present();
    }
    private addItem() {
        this.alertCtrl.create({
            title: this.translate.instant('adding-element-modal-title'),
            message: this.translate.instant('adding-element-modal-content') + ' ' + this.list.name + '.',
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Item name'
                },
                {
                    name: 'desc',
                    placeholder: 'Item description'
                },
                {
                    name: 'completed',
                    type: 'checkbox',
                    label: 'Is completed ?'
                },
            ] ,
            buttons: [
                {
                    text: this.translate.instant('cancel-button-caption'),
                    role: 'cancel'
                },
                {
                    text: this.translate.instant('valid-button-caption'),
                    handler: data => {
                        this.todoService.addTodo(this.list.uuid, data.name, data.completed, data.desc);
                    }
                }
            ]
        }).present();
    }
    private editItem(item : TodoItem) {
        this.alertCtrl.create({
            title: this.translate.instant('editing-element-modal-title'),
            message: this.translate.instant('editing-element-modal-content') + ' ' + this.list.name + '.',
            inputs: [
                {
                    name: 'name',
                    value : item.name
                },
                {
                    name: 'desc',
                    value : item.desc || ""
                },
                {
                    name: 'completed',
                    label: 'Is completed ?',
                    type: 'checkbox',
                    checked : item.complete
                }
            ] ,
            buttons: [
                {
                    text: this.translate.instant('cancel-button-caption'),
                    role: 'cancel'
                },
                {
                    text: this.translate.instant('valid-button-caption'),
                    handler: (data) => {
                        this.todoService.editTodo(this.list.uuid, {uuid : item.uuid, name: data.name, desc : data.desc, complete : data.completed });
                    }
                }
            ]
        }).present();
    }
}
