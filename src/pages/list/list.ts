import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicModule, AlertController } from 'ionic-angular';
import { TodoList } from '../../model/todo-list.model';
import { TodoItem } from '../../model/todo-item.model';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { TodoProvider } from '../../providers/todo/todo';
import { LoggerProvider } from '../../providers/logger/logger';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { TodoFormPage } from '../todo-form/todo-form';
import { reorderArray } from 'ionic-angular';

/**
* Generated class for the ListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

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
        private translate: TranslateService,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder)
    {
        var uuid = this.navParams.get('id');
        var name = this.navParams.get('name');

        this.list = {
            index: 0,
            uuid: uuid,
            name: name,
            items: [],
            geoloc: ''
        };
        this.todoService.getTodos(uuid).subscribe(todoItems => {
            this.list.items = todoItems;
        });
    }

    private ionViewDidLoad() {
        this.geolocate(null);
        if (!this.logger.isLogged())
            this.navCtrl.setRoot(LoginPage);
    }

    private ionViewWillEnter() {
        if (!this.logger.isLogged())
            this.navCtrl.setRoot(LoginPage);
    }

    private returnParentPage() {
        this.navCtrl.setRoot(HomePage);
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

    /**
     * Affiche un formulaire d'ajout d'une nouvelle tâche pour la liste courante
     */
    private addItem() {
        this.navCtrl.push(TodoFormPage, { uid: this.list.uuid });
    }

    /**
     * Affiche un popup utilisateur de mise à jour pour une tâche spécifiée
     * @param item La tâche utilisateur à mêttre à jour
     */
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

    /**
     * Géolocalise l'utilisateur et fournit les informations textuelles correspondantes à la tâche spécifiée
     * @param todo La tâche prenant en charge les informations textuelles de géolocalisation
     */
    private geolocate(todo: TodoItem) {
        console.log('geoloc');
        this.geolocation.getCurrentPosition().then((resp) => {
            console.log(resp);
            return this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude);
        }).then((result: NativeGeocoderReverseResult) => {
            console.log('geolocate:', JSON.stringify(result));
        }).catch((error: any) => {
            console.log('geolocate error:', error);
        });
    }

    private reorderItems(indexes): void {
        console.log("pages.list.reorderItems", indexes);
        this.list.items = reorderArray(this.list.items, indexes);
        // TODO: Save in database reorder
    }
}
