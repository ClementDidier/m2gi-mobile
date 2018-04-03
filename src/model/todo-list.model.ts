import {TodoItem} from './todo-item.model';

export interface TodoList {
    index: number;
    uuid : string;
    name : string;
    items : TodoItem[];
    geoloc: string;
}
