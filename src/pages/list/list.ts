import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicModule, AlertController } from 'ionic-angular';
import { TodoList } from '../../model/todo-list.model';
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
    list: TodoList;

    constructor(public navCtrl: NavController, public navParams: NavParams, public todoService: TodoProvider, private alertCtrl: AlertController) {
        var uuid = this.navParams.get('id');
        this.list = {
            uuid: uuid,
            name: 'listName',
            items: []
        };
        this.todoService.getTodos(uuid).subscribe(todoItems => this.list.items = todoItems);
    }

    private ionViewDidLoad() {
        console.log('ionViewDidLoad ListPage');
    }

    public deleteItem(listid : string, todoid : string) {
        this.confirmItemDeletion(listid, todoid);
    }

    private confirmItemDeletion(listId, todoId) {
        let alert = this.alertCtrl.create({
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
        });
        alert.present();
    }
}
