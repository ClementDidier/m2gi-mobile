import { Component, Input } from '@angular/core';
import { TodoItem } from '../../model/todo-item.model';
import { NavController } from 'ionic-angular';
import { TodoViewPage } from '../../pages/todo-view/todo-view';
import { TodoProvider } from '../../providers/todo/todo';

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

    @Input()
    public listuid: string;

    constructor(private navCtrl: NavController, public todoService: TodoProvider) {
        // nothing
    }

    public checkItem(): void{
      this.todo.complete = !this.todo.complete;
      this.todoService.editTodo(this.listuid, this.todo);
    }
    public showTask(): void {
        this.navCtrl.push(TodoViewPage, { todo: this.todo });
    }
}
