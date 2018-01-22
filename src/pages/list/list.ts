import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicModule } from 'ionic-angular';
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

    constructor(public navCtrl: NavController, public navParams: NavParams, public todoService: TodoProvider) {
        var uuid = this.navParams.get('id');
        this.list = {
            uuid: uuid,
            name: 'listName',
            items: []
        };
        this.todoService.getTodos(uuid).subscribe(todoItems => this.list.items = todoItems);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ListPage');
    }

    deleteItem() {
        console.log('');
    }
}
