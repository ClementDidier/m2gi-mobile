import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TodoItemComponent } from './todo-item/todo-item';
import { TodoListComponent } from './todo-list/todo-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [TodoItemComponent, TodoListComponent],
	imports: [IonicModule, TranslateModule.forChild()],
	exports: [TodoItemComponent, TodoListComponent]
})
export class ComponentsModule {}
