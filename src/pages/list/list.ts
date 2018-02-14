import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicModule, AlertController } from 'ionic-angular';
import { TodoList } from '../../model/todo-list.model';
import { TodoItem } from '../../model/todo-item.model';
import { LoginPage } from '../login/login';
import { TodoProvider } from '../../providers/todo/todo';

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

    constructor(public navCtrl: NavController, public navParams: NavParams, public todoService: TodoProvider, private alertCtrl: AlertController) {
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
        this.navCtrl.setRoot(LoginPage);
    }

    public deleteItem(listid : string, todoid : string) {
        this.confirmItemDeletion(listid, todoid);
    }

    private confirmItemDeletion(listId, todoId) {
        this.alertCtrl.create({
            title: 'Confirmation de suppression',
            message: "Êtes-vous sûr de supprimer l'élément ?",
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Valider',
                    handler: () => {
                        this.todoService.deleteTodo(listId, todoId);
                    }
                }
            ]
        }).present();
    }
    private addItem() {
        this.alertCtrl.create({
            title: 'Ajouter un item',
            message: 'Entrez les informations sur l\élement à ajouter à la liste ' + this.list.name + '.',
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
                    text: 'Annuler',
                    role: 'cancel'
                },
                {
                    text: 'Valider',
                    handler: data => {
                        this.todoService.addTodo(this.list.uuid, data.name, data.completed, data.desc);
                    }
                }
            ]
        }).present();
    }
    private editItem(item : TodoItem) {
        this.alertCtrl.create({
            title: 'Modifier un item',
            message: 'Entrez les informations sur l\élement à modifier de la liste ' + this.list.name + '.',
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
                    text: 'Annuler',
                    role: 'cancel'
                },
                {
                    text: 'Valider',
                    handler: (data) => {
                        this.todoService.editTodo(this.list.uuid, {uuid : item.uuid, name: data.name, desc : data.desc, complete : data.completed });
                    }
                }
            ]
        }).present();
    }
}
