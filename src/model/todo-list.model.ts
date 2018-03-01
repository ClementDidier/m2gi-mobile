import {TodoItem} from './todo-item.model';

export interface TodoList {
    uuid : string;
    name : string;
    items : TodoItem[];
}
