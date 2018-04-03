import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoProvider } from '../../providers/todo/todo';
import { TodoItem } from '../../model/todo-item.model';
import { TodoList } from '../../model/todo-list.model';
import { ListPage } from '../../pages/list/list';
import { ListFormPage } from '../../pages/list-form/list-form';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, reorderArray } from 'ionic-angular';
import { LoggerProvider } from '../../providers/logger/logger';
import { SharePage } from '../../pages/share/share';

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
    private items: TodoList[] = [];

    constructor(public todoService: TodoProvider, public navCtrl: NavController, private alertCtrl: AlertController, private translate: TranslateService, private logger: LoggerProvider) {
        this.subscriber = this.todoService.getListsOfUser(this.logger.getUserId());
        this.subscriber.subscribe(items => {
            this.items = items;
        });
    }

    private ionViewDidLoad() {
        // nothing
    }

    /**
     * Obtient le nombre de tâches terminées dans la liste courante
     * @param items La liste comportant les tâches à identifier
     */
    public isCompleteCount(items : TodoItem[]) {
        let result = 0;
        for(var keyitem in items){
            if (items[keyitem].complete)
                result++;
        }
        return result;
    }

    public itemCount(items : TodoItem[]) {
        let result = 0;
        for(var keyitem in items){
            result++;
        }
        return result;
    }

    public pushPage(list : TodoList) {
        this.navCtrl.push(ListPage, {
            id : list.uuid,
            name : list.name,
        });
    }

    /**
     * Execute une demande de confirmation de suppression de la liste spécifiée auprès de l'utilisateur
     * @param listuuid Identifiant de la liste à supprimer
     */
    public deleteList(listuuid : string) {
        this.confirmListDeletion(listuuid);
    }

    /**
     * Affiche la demande de suppression de la liste spécifiée auprès de l'utilisateur. Invoque la méthode de suppression si validée.
     * @param listUuid Identifiant de la liste à supprimer
     */
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

    /**
     * Affiche le formulaire d'ajout d'une nouvelle liste de tâches
     */
    private addList() {
        this.navCtrl.push(ListFormPage);
        this.subscriber = this.todoService.getListsOfUser(this.logger.getUserId());
        this.subscriber.subscribe(items => {
            this.items = items;
        });
    }

    /**
     * Ouvre la page de partage de liste entre utilisateur
     * @param list La liste à partager
     */
    private shareList(list: TodoList): void {
        this.navCtrl.push(SharePage, { 'list': list });
    }

    /**
     * Edite la liste spécifiée par les nouvelles données entrées
     * @param list La liste à éditée
     */
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

    private reorderItems(indexes): void {
        console.log("pages.list.reorderItems", indexes);
        this.items = reorderArray(this.items, indexes);
        // TODO: Save in database reorder

        var list1 = this.items[indexes.from];
        var list2 = this.items[indexes.to];
        
        this.todoService.swapListsIndexes(list1, list2);
    }
}
