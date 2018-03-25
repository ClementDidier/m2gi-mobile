import { Component, Input } from '@angular/core';
import { TodoItem } from '../../model/todo-item.model';

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

    constructor() {
    }


}
