import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoProvider } from '../../providers/todo/todo';
import { TodoItem } from '../model/todo-item.model';
import { TodoList } from '../model/todo-list.model';

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
  items: TodoItem[];
	
  constructor(@Inject(TodoProvider) todoService: TodoProvider) {
    this.subscriber = todoService.getList().subscribe(items => this.items = items);
  }

  public isCompleteCount(items : TodoList) {
	let result = 0;
	items.forEach(i => { if(i.complete) result++});
	return result;
  }
}
