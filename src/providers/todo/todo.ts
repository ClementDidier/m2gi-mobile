import { Injectable } from '@angular/core';
import {TodoItem} from "../../model/todo-item.model";
import {TodoList} from "../../model/todo-list.model";
import {Observable} from "rxjs/Observable";
import {v4 as uuid} from 'uuid';
import { FIREBASE_CREDENTIALS } from '../../firebase.credentials';
import 'rxjs/Rx';
import { LoggerProvider } from '../logger/logger';
import { HttpClient } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
/*
Generated class for the TodoProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class TodoProvider {

    data:TodoList[] = [
        {
            uuid : "a351e558-29ce-4689-943c-c3e97be0df8b",
            name : "🔧 List 1",
            items : [
                {
                    uuid : "7dc94eb4-d4e9-441b-b06b-0ca29738c8d2",
                    name : "🍳 Item 1-1",
                    complete : false
                },
                {
                    uuid : "20c09bdd-1cf8-43b0-9111-977fc4d343bc",
                    name : "⚕️ Item 1-2",
                    desc : "This is the description of the 1-2 item",
                    complete : false
                },
                {
                    uuid : "bef88351-f4f1-4b6a-965d-bb1a4fa3b444",
                    name : "🔬 Item 1-3",
                    complete : true
                }
            ]
        },
        {
            uuid : "90c04913-c1a2-47e5-9535-c7a430cdcf9c",
            name : "🎨 List 2",
            items : [
                {
                    uuid : "72849f5f-2ef6-444b-98b0-b50fc019f97c",
                    name : "🎤 Item 2-1",
                    complete : false
                },
                {
                    uuid : "80d4cbbe-1c64-4603-8d00-ee4932045333",
                    name : "✍ Item 2-2",
                    complete : true
                },
                {
                    uuid : "a1cd4568-590b-428b-989d-165f22365485",
                    name : "🐡 Item 2-3",
                    complete : true
                }
            ]
        }
    ];

    constructor(private firedatabase : AngularFireDatabase, private fireauth: AngularFireAuth, private http: HttpClient) {
    }

    public getList(): Observable<TodoList[]> {
        return Observable.of(this.data);
    }

    public getTodos(uid: String) : Observable<TodoItem[]> {
        return Observable.of(this.data.find(d => d.uuid == uid).items);
    }

    public editTodo(listUuid : String, editedItem: TodoItem): void {
        let items = this.data.find(d => d.uuid == listUuid).items;
        let index = items.findIndex(value => value.uuid == editedItem.uuid);
        items[index] = editedItem;
    }

    public editList(listUuid : String, listName : String): void {
        let list = this.data.find(d => d.uuid == listUuid);
        let index = this.data.findIndex(value => value.uuid == listUuid);
        if (index != -1) {
            this.data[index].name = listName.toString();
        }
    }

    public deleteTodo(listUuid: String, uid: String): void {
        let items = this.data.find(d => d.uuid == listUuid).items;
        let index = items.findIndex(value => value.uuid == uid);
        if (index != -1) {
            items.splice(index,1);
        }
    }

    public deleteList(listUuid: String): void {
        let list = this.data.find(d => d.uuid == listUuid);
        let index = this.data.findIndex(value => value.uuid == listUuid);
        if (index != -1) {
            this.data.splice(index,1);
        }
    }

    public addList(name: String): void {
      console.log(this.firedatabase.list('/lists').push('{ uuid : '+ uuid() + ', name :' + name.toString() + ', items : []}'));
      //console.log(this.http.post( FIREBASE_CREDENTIALS.databaseURL + this.fireauth.auth.currentUser.uid,'{ uuid : '+ uuid() + ', name :' + name.toString() + ', items : []}'));
    }

    public addTodo(listUuid: String, itemName : String, completed : boolean, description : String): void {
        let list = this.data.find(d => d.uuid === listUuid);
        let index = this.data.findIndex(value => value.uuid === listUuid);
        if (index != -1) {
            this.data[index].items.push({
                uuid : uuid(),
                name : itemName.toString(),
                complete : completed,
                desc : description.toString(),
            });
        }
    }
}
