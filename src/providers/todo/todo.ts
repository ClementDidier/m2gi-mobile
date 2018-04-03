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

	public getUsersEmail(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			var users = [];
			var url = '/users/';
			var ref = this.firedatabase.database.ref(url);
			ref.once('value', (list) => {
				var usrs = list.val();
				usrs.forEach(u => {
					users.push(u.email || 'private@address.com');
				});
				resolve(users);
			});
		});
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
			if (listsId) {
				for (var id in listsId) {
					this.getListByUid(listsId[id]).then((val) => {
						console.log('getListsOfUser', val);
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
	public getListByUid(uid: string): Promise<TodoList> {
		return new Promise((resolve, reject) => {
			var url = `/lists/`;
			var ref = this.firedatabase.database.ref(url);
			ref.orderByChild("uuid").equalTo(uid);
			ref.once('value').then((listSnapshot) => {
				// TODO: test if list exists
				var snap = listSnapshot.val();
				for (var list in snap) {
					if (snap[list]['uuid'] == uid) {
						if (!snap[list]['items']) {
							snap[list]['items'] = [];
						}
						else {
							snap[list]['items'] = Object.keys(snap[list]['items']).map(function (itemindex) {
								let item = snap[list]['items'][itemindex];
								return item;
							});
						}
						resolve(snap[list]);
						break;
					}
				}
			});
		});
	}

	public getListIdByUid(uid: string): any {
		return new Promise((resolve, reject) => {
			var url = `/lists/`;
			var ref = this.firedatabase.database.ref(url);
			ref.orderByChild("uuid").equalTo(uid);
			ref.once('value').then((listSnapshot) => {
				// TODO: test if list exists
				var snap = listSnapshot.val();
				for (var list in snap) {
					if (snap[list]['uuid'] == uid) {
						if (!snap[list]['items']) {
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
	 * Obtient la tâche selon son identifiant unique et celui de sa liste parente
	 * @param listUid L'identifiant de la liste parente
	 * @param todoUid L'identifiant de la tâche recherchée
	 */
	public getTodoIdByUid(listUid: string, todoUid: string): any {
		return new Promise((resolve, reject) => {
			this.getListIdByUid(listUid).then((listId) => {
				var url = `/lists/${listId}/items`;
				var ref = this.firedatabase.database.ref(url);
				ref.orderByChild("uuid").equalTo(todoUid);
				ref.once('value').then((listSnapshot) => {
					// TODO: test if list exists
					var snap = listSnapshot.val();
					for (var key in snap) {
						if (snap[key]['uuid'] == todoUid) {
							resolve(key);
							break;
						}
					}
				});
			});
		});
	}

	/**
	 * Obtient l'ensemble des tâches appartenant à la liste spécifiée
	 * @param uid L'identifiant de la liste parente des tâches recherchées
	 */
	public getTodos(uid: string): Observable<TodoItem[]> {
		var todos = [];
		var varthis = this;
		var shhh;
		this.getListByUid(uid).then((val) => {
			for (var key in val['items']) {
				todos.push(val['items'][key]);
			}
			shhh = val;
		});
		let list = this.data.find(d => d.uuid == uid);
		let index = this.data.findIndex(value => value.uuid === uid);
		this.data[index].items = todos;
		return Observable.of(this.data[index].items);
	}

	/**
	 * Met à jour une tâche sur la base de données distante
	 * @param listUuid L'identifiant de la liste parente
	 * @param editedItem La nouvelle tâche
	 */
	public editTodo(listUuid: string, editedItem: TodoItem): void {
		var varthis = this;
		var todoId;
		this.getTodoIdByUid(listUuid, editedItem.uuid).then((itemid) => {
			varthis.getListIdByUid(listUuid).then((listid) => {
				var baseitem = varthis.firedatabase.list(`/lists/${listid}/items/`);
				baseitem.update(itemid, editedItem);
				varthis.getTodos(listUuid);
			});
		});
	}

	/**
	 * Met à jour la liste
	 * @param listUuid L'identifiant de la liste à modifier
	 * @param listName Le nouveau nom de la liste
	 */
	public editList(listUuid: string, listName: string): void {
		this.getListIdByUid(listUuid).then((listid) => {
			var baseitem = this.firedatabase.list(`/lists/`);
			baseitem.update(listid, { 'name': listName });
			this.getListsOfUser(this.logger.getUserId());
		});
		/*
		let list = this.data.find(d => d.uuid == listUuid);
		let index = this.data.findIndex(value => value.uuid == listUuid);
		if (index != -1) {
			this.data[index].name = listName.toString();
		}*/
	}

	public swapListsIndexes(list1: TodoList, list2: TodoList): void {
		var baseitem = this.firedatabase.list(`/lists/`);
		var lid1, lid2;
		Promise.all([this.getListIdByUid(list1.uuid), this.getListIdByUid(list2.uuid)]).then(([lid1, lid2]) => {
			var index = list1.index;
			baseitem.update(lid1, { 'index': list2.index });
			baseitem.update(lid2, { 'index': index });
		}).catch((err) => {
			console.log(err);
		});
	}

	public deleteTodo(listUuid: string, todouid: string): Observable<any> {
		var varthis = this;
		var todoId;
		this.getTodoIdByUid(listUuid, todouid).then((itemid) => {
			varthis.getListIdByUid(listUuid).then((listid) => {
				var baseitem = varthis.firedatabase.list(`/lists/${listid}/items/${itemid}`);
				baseitem.remove();
				return varthis.getTodos(listUuid);
			});
		});
		return varthis.getTodos(listUuid);
		/*
		let items = this.data.find(d => d.uuid == listUuid).items;
		let index = items.findIndex(value => value.uuid == uid);
		if (index != -1) {
			items.splice(index, 1);
		}*/
	}

	public deleteList(listUuid: string): void {
		this.getListIdByUid(listUuid).then((listid) => {
			var baseitem = this.firedatabase.list(`/lists/${listid}`);
			baseitem.remove();
			//TODO: remove la liste des users
			this.getListsOfUser(this.logger.getUserId());
		});
		/*
		let list = this.data.find(d => d.uuid == listUuid);
		let index = this.data.findIndex(value => value.uuid == listUuid);
		if (index != -1) {
			this.data.splice(index, 1);
		}*/
	}

	/**
	 * Ajoute la nouvelle liste à la base de données distante
	 * @param name Le nom de la nouvelle liste
	 * @param userId L'identifiant de l'utilisateur propriétaire
	 */
	public addList(name: string, userId: string): void {

		var newList = this.firedatabase.list('/lists').push('{}');
		this.getNewListIndex().then((i) => {
			console.log('index', i);
			var newuuid = uuid();
			newList.set(
				{
					index: i,
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
		}).catch((error) => {
			console.error(error);
		});

		//console.log(this.http.post( FIREBASE_CREDENTIALS.databaseURL + this.fireauth.auth.currentUser.uid,'{ uuid : '+ uuid() + ', name :' + name.toString() + ', items : []}'));
	}

	getNewListIndex(): Promise<number> {
		return new Promise((resolve, reject) => {
			var ref = this.firedatabase.database.ref('/lists');
			ref.once("value", (snapshot) => {
				resolve(snapshot.numChildren());
			}, (error) => {
				reject(error);
			});
		});
	}

	/**
	 * Ajoute une nouvelle tâche
	 * @param listUuid L'identifiant de la liste parente
	 * @param itemName Le nom de la tâche
	 * @param completed L'état de completude de la tâche
	 * @param description La description de la tâche
	 * @param img Image du todo
	 */
	public addTodo(listUuid: string, itemName: String, completed: boolean, description: String, img : string): void {
		var varthis = this;
		var newuuid = uuid();
		this.getListIdByUid(listUuid).then((listid) => {
			var newTodo = this.firedatabase.list(`/lists/${listid}/items`).push('{}');
			newTodo.set({
				uuid: newuuid,
				name: itemName.toString(),
				complete: completed,
				desc: description.toString(),
				img : img
			});
			varthis.getListByUid(listUuid).then((val) => {
				let list = varthis.data.find(d => d.uuid == val.uuid);
				let index = varthis.data.findIndex(value => value.uuid === listUuid);
				if (index != -1) {
					varthis.data[index].items.push(val.items.find(d => d.uuid == newuuid));
				}
			});
		});
	}
}
