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
import { combineLatest } from 'rxjs/observable/combineLatest';
/*
Generated class for the TodoProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class TodoProvider {

    data:TodoList[]=[];

    constructor(private logger: LoggerProvider, private firedatabase : AngularFireDatabase, private fireauth: AngularFireAuth, private http: HttpClient) {
      console.log(this.logger.getUserId())
      //var angularDataList = this.firedatabase.list('/lists');
      //this.data = this.todoListPresenter(angularDataList.snapshotChanges());
    }

    public getList(): Observable<TodoList[]> {
      var uid = this.logger.getUserId();
      var user = this.firedatabase.list(`/users/${uid}`);
      console.log('test2');
      var obsListID = this.firedatabase.list(`/users/${uid}/lists`);
      console.log(obsListID);
      var obsTodoLists = combineLatest(obsListID.snapshotChanges().map(lID => this.firedatabase.list(`lists/${lID}`).snapshotChanges()));
      console.log(this.todoListPresenter(obsTodoLists));
      var angularDataList = this.firedatabase.list('/lists');
      console.log(this.todoListPresenter(angularDataList.snapshotChanges()));
      return this.todoListPresenter(obsTodoLists);
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
      var newList = this.firedatabase.list('/lists').push('{}');
      newList.set(
         {
           uuid :  uuid() ,
           name : name.toString(),
           items: []
        }
      );
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

  // Provided by Alban Bertolini
  private todoListPresenter(todoList) {
    return todoList.map(changes => {
      return changes.map(c => ({
        uuid: c.payload.key,
        ...c.payload.val(),
        items: this.itemsPresenter(c.payload.val().items)
      }));
    });
  }

  public itemsPresenter(items) {
    if (!items) { return []; }

    return Object.keys(items).map(function(key) {
      const item = items[key];
      return {
        uuid: key,
        ...item
      };
    });
  }
}
