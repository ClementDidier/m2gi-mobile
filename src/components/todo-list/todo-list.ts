import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoProvider } from '../../providers/todo/todo';
import { TodoItem } from '../../model/todo-item.model';
import { TodoList } from '../../model/todo-list.model';
import { ListPage } from '../../pages/list/list';
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

    subscriber: Observable<TodoList[]>;
    items: TodoList[];

    constructor(public todoService: TodoProvider, public navCtrl: NavController, private alertCtrl: AlertController) {
        this.subscriber = todoService.getList();
        this.subscriber.subscribe(items => this.items = items);
    }

    public isCompleteCount(items : TodoItem[]) {
        let result = 0;
        items.forEach(i => { if(i.complete) result++});
        return result;
    }

    public pushPage(list : TodoList){
        this.navCtrl.push(ListPage,{
            id: list.uuid,
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
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
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
}
