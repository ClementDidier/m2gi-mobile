import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TodoItemComponent } from './todo-item/todo-item';
import { TodoListComponent } from './todo-list/todo-list';

@NgModule({
	declarations: [TodoItemComponent,
    TodoListComponent],
	imports: [IonicModule],
	exports: [TodoItemComponent,
    TodoListComponent]
})
export class ComponentsModule {}
