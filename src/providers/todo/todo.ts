import { Injectable } from '@angular/core';
import { TodoItem } from "../../model/todo-item.model";
import { TodoList } from "../../model/todo-list.model";
import { Observable } from "rxjs/Observable";
import { v4 as uuid } from 'uuid';
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

	data: TodoList[] = [];

	constructor(private logger: LoggerProvider, private firedatabase: AngularFireDatabase, private fireauth: AngularFireAuth, private http: HttpClient) {
		// nothing
	}

	/**
	 * Obtient l'ensemble des listes de l'utilisateur spécifié
	 * @param userId L'identifiant de l'utilisateur pour lequel les listes doivent être récupérées
	 */
	public getListsOfUser(userId: string) {
			var lists = [];
			var url = `/users/${userId}/lists/`;
			var ref = this.firedatabase.database.ref(url);
			ref.once('value', (listSnapshot) => {
				var listsId = listSnapshot.val();
				if(listsId) {
					for(var id in listsId){
						this.getListByUid(listsId[id]).then((val) => {
							console.log(val);
							lists.push(val);
						});
					}
				}
			});
			this.data = lists;
			return Observable.of(this.data);
	}

	/**
	 * Obtient la liste avec le nom identifiant spécifié
	 * @param id Le nom identifiant la liste à obtenir
	 */
	public getListById(id: string) {
			return new Promise((resolve, reject) => {
						var url = `/lists/${id}`;
			 			var ref = this.firedatabase.database.ref(url);
			 			ref.once('value', (listSnapshot) => {
							resolve(listSnapshot.val());
						});
					});
	}

	/**
	 * Obtient la liste avec l'identifiant unique spécifié
	 * @param uid L'identifiant unique de la liste à obtenir
	 */
	public getListByUid(uid: string) : Promise<TodoList> {
			return new Promise((resolve, reject) => {
						var url = `/lists/`;
						var ref = this.firedatabase.database.ref(url);
						ref.orderByChild("uuid").equalTo(uid);
						ref.once('value').then((listSnapshot) => {
							// TODO: test if list exists
							var snap = listSnapshot.val();
							for(var list in snap){
								if (snap[list]['uuid'] == uid){
									if(!snap[list]['items']){
										snap[list]['items'] = [];
									}
									else{
										snap[list]['items'] = Object.keys(snap[list]['items']).map(function(itemindex){
																						    					let item = snap[list]['items'][itemindex];
																						    					return item;
																												});
									}
									console.log(snap[list]);
									resolve(snap[list]);
									break;
								}
							}
						});
					});
	}

	public getListIdByUid(uid: string) {
			return new Promise((resolve, reject) => {
						var url = `/lists/`;
						var ref = this.firedatabase.database.ref(url);
						ref.orderByChild("uuid").equalTo(uid);
						ref.once('value').then((listSnapshot) => {
							// TODO: test if list exists
							var snap = listSnapshot.val();
							for(var list in snap){
								if (snap[list]['uuid'] == uid){
									if(!snap[list]['items']){
										snap[list]['items'] = [];
									}
									resolve(list);
									break;
								}
							}
						});
					});
	}

	/**
	* @deprecated
	**/
	public getList(): Observable<TodoList[]> {
		var uid = this.logger.getUserId();
		var user = this.firedatabase.list(`/users/${uid}`);
		var obsListID = this.firedatabase.list(`/users/${uid}/lists`);
		var obsTodoLists = combineLatest(obsListID.snapshotChanges().map(lID => this.firedatabase.list(`lists/${lID}`).snapshotChanges()));
		var angularDataList = this.firedatabase.list('/lists');
		return this.todoListPresenter(obsTodoLists);
	}


	public getTodos(uid: string): Observable<TodoItem[]> {
		var todos = [];
		var varthis = this;
		var shhh;
		this.getListByUid(uid).then((val) => {
			for(var key in val['items']){
				todos.push(val['items'][key]);
			}
			shhh = val;
		});
		 let list = this.data.find(d => d.uuid == uid);
		 let index = this.data.findIndex(value => value.uuid === uid);
		 this.data[index].items = todos;
		return Observable.of(this.data[index].items);
	}

	public editTodo(listUuid: String, editedItem: TodoItem): void {/*
		let items = this.data.find(d => d.uuid == listUuid).items;
		let index = items.findIndex(value => value.uuid == editedItem.uuid);
		items[index] = editedItem;*/
	}

	public editList(listUuid: String, listName: String): void {/*
		let list = this.data.find(d => d.uuid == listUuid);
		let index = this.data.findIndex(value => value.uuid == listUuid);
		if (index != -1) {
			this.data[index].name = listName.toString();
		}*/
	}

	public deleteTodo(listUuid: String, uid: String): void {/*
		let items = this.data.find(d => d.uuid == listUuid).items;
		let index = items.findIndex(value => value.uuid == uid);
		if (index != -1) {
			items.splice(index, 1);
		}*/
	}

	public deleteList(listUuid: String): void {/*
		let list = this.data.find(d => d.uuid == listUuid);
		let index = this.data.findIndex(value => value.uuid == listUuid);
		if (index != -1) {
			this.data.splice(index, 1);
		}*/
	}

	public addList(name: string, userId : string): void {
		var newList = this.firedatabase.list('/lists').push('{}');
		var newuuid = uuid();
		newList.set(
			{
				uuid: newuuid,
				name: name.toString(),
				items: []
			}
		);
		var newListForUser = this.firedatabase.list(`/users/${userId}/lists`).push(`${newuuid}`);
		var vardata = this.data;
		this.getListByUid(newuuid).then((val) => {
			vardata.push(val);
		});
		//console.log(this.http.post( FIREBASE_CREDENTIALS.databaseURL + this.fireauth.auth.currentUser.uid,'{ uuid : '+ uuid() + ', name :' + name.toString() + ', items : []}'));
	}

	public addTodo(listUuid: string, itemName: String, completed: boolean, description: String): void {
		var varthis = this;
		var newuuid = uuid();
		this.getListIdByUid(listUuid).then((listid) => {
			var newTodo = this.firedatabase.list(`/lists/${listid}/items`).push('{}');
			newTodo.set({
					uuid: newuuid,
					name: itemName.toString(),
					complete: completed,
					desc: description.toString(),
				});
		});
		 this.getListByUid(listUuid).then((val) => {
		 let list = varthis.data.find(d => d.uuid == val.uuid);
		 let index = varthis.data.findIndex(value => value.uuid === listUuid);
		 if (index != -1) {
		 		varthis.data[index].items.push(val.items[newuuid]);
		 	}
		 });
		 let list = this.data.find(d => d.uuid == listUuid);
		 let index = this.data.findIndex(value => value.uuid === listUuid);
		// if (index != -1) {
		// 		this.data[index].items.push({
		// 				uuid: newuuid,
		// 				name: itemName.toString(),
		// 				complete: completed,
		// 				desc: description.toString(),
		// 			});
		// 	}
		 	console.log(this.data[index]);

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

		return Object.keys(items).map((key) => {
			const item = items[key];
			return {
				uuid: key,
				...item
			};
		});
	}
}
