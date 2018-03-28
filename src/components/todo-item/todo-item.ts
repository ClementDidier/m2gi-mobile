import { Component, Input } from '@angular/core';
import { TodoItem } from '../../model/todo-item.model';
import { NavController } from 'ionic-angular';
import { TodoViewPage } from '../../pages/todo-view/todo-view';

/**
* Generated class for the TodoItemComponent component.
*
* See https://angular.io/api/core/Component for more info on Angular
* Components.
*/
@Component({
    selector: 'todo-item',
    templateUrl: 'todo-item.html'
})
export class TodoItemComponent {

    @Input()
    public todo: TodoItem;

    constructor(private navCtrl: NavController) {
        // nothing
    }

    public showTask(): void {
        this.navCtrl.push(TodoViewPage, { todo: this.todo });
    }
}
