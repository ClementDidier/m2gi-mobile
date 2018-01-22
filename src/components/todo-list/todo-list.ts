import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoProvider } from '../../providers/todo/todo';
import { TodoItem } from '../../model/todo-item.model';
import { TodoList } from '../../model/todo-list.model';
import { ListPage } from '../../pages/list/list';
import { NavController } from 'ionic-angular';
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

  constructor(@Inject(TodoProvider) todoService: TodoProvider, public navCtrl: NavController) {
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
}
