import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoProvider } from '../../providers/todo/todo';
import { TodoItem } from '../../model/todo-item.model';
import { TodoList } from '../../model/todo-list.model';
import { ListPage } from '../../pages/list/list';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController } from 'ionic-angular';
/**
* Generated class for the TodoListComponent component.
*
* See https://angular.io/api/core/Component for more info on Angular
* Components.
*/
@Component({
    selector: 'todo-list',
    templateUrl: 'todo-list.html'
})
export class TodoListComponent {

    private subscriber: Observable<TodoList[]>;
    private items: TodoList[];

    constructor(public todoService: TodoProvider,
         public navCtrl: NavController,
         private alertCtrl: AlertController,
         private translate: TranslateService) {
        this.subscriber = todoService.getList();
        this.subscriber.subscribe(items => this.items = items);
    }

    public isCompleteCount(items : TodoItem[]) {
        let result = 0;
        items.forEach((i) => {
            if (i.complete)
                result++;
        });
        return result;
    }

    public pushPage(list : TodoList) {
        this.navCtrl.push(ListPage, {
            id : list.uuid,
            name : list.name,
        });
    }

    public deleteList(listuuid : string) {
        this.confirmListDeletion(listuuid);
    }

    private confirmListDeletion(listUuid) {
        let alert = this.alertCtrl.create({
            title: 'Confirmation de suppression',
            message: 'Êtes-vous sûr de supprimer la liste ?',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel'
                },
                {
                    text: 'Valider',
                    handler: () => {
                        this.todoService.deleteList(listUuid);
                    }
                }
            ]
        });
        alert.present();
    }

    private addList() {
        this.alertCtrl.create({
            title: 'Ajouter une liste',
            message: 'Entrez un nom pour cette liste :',
            inputs: [
                {
                    name: 'listname',
                    placeholder: 'List name'
                },
            ] ,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                },
                {
                    text: 'Valider',
                    handler: (data) => {
                        this.todoService.addList(data.listname);
                    }
                }
            ]
        }).present();
    }
    private editList(list : TodoList) {
        this.alertCtrl.create({
            title: 'Editer une liste',
            message: 'Entrez un autre nom pour cette liste :',
            inputs: [
                {
                    name: 'listname',
                    placeholder: 'List name',
                    value : list.name
                },
            ] ,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel'
                },
                {
                    text: 'Valider',
                    handler: (data) => {
                        this.todoService.editList(list.uuid, data.listname);
                    }
                }
            ]
        }).present();
    }
}
