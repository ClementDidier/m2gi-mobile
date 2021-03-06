import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../providers/logger/logger';
import { TodoProvider } from '../../providers/todo/todo';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
	selector: 'page-todo-form',
	templateUrl: 'todo-form.html',
})
export class TodoFormPage {

	private listUID: string;
	private taskname: string;
	private taskdesc: string;
	private taskimg: string;
	private geo: any;
private camOptions: CameraOptions;
	constructor(private translate: TranslateService, private geoloc: Geolocation, private logger: LoggerProvider, private totoProvider: TodoProvider, public navCtrl: NavController, public navParams: NavParams, private alert: AlertController, private camera: Camera) {
		this.listUID = this.navParams.get('uid');
		this.taskimg = '';
		this.geo = null;
    this.camOptions = {
  		quality: 100,
  		destinationType: camera.DestinationType.DATA_URL,
  		encodingType: camera.EncodingType.JPEG,
  		mediaType: camera.MediaType.PICTURE,
  		targetWidth: 700,
  		targetHeight: 700,
  	};

	}

	ionViewDidLoad() {
		// nothing
	}

	addGeo() {
		this.geoloc.getCurrentPosition().then((position) => {
			this.geo = { longitude: '', latitude: '' };
			this.geo.longitude = position.coords.longitude;
			this.geo.latitude = position.coords.latitude;
		});
	}

	rmGeo() {
		this.geo = null;
	}

	addImg() {
		this.camera.getPicture(this.camOptions).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64:
			this.taskimg = 'data:image/jpeg;base64,' + imageData;
		}, (err) => {
			// Handle error
		});
	}

	rmImg() {
		this.taskimg = '';
	}

	addTask(): void {
		if (this.taskname) {
			this.totoProvider.addTodo(this.listUID, this.taskname || "???", false, this.taskdesc || "", this.taskimg || '', this.geo);
			this.navCtrl.pop();
		}
	}

	returnPrecPage(): void {
		this.navCtrl.pop();
	}
}
