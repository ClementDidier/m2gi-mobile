import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../providers/logger/logger';
import { TodoProvider } from '../../providers/todo/todo';
import { Camera, CameraOptions } from '@ionic-native/camera';
@Component({
  selector: 'page-todo-form',
  templateUrl: 'todo-form.html',
})
export class TodoFormPage {

	private listUID: string;
	private taskname: string;
	private taskdesc: string;
  private taskimg : string;
	constructor(private translate: TranslateService, private logger: LoggerProvider, private totoProvider: TodoProvider, public navCtrl: NavController, public navParams: NavParams, private alert: AlertController, private camera: Camera) {
		this.listUID = this.navParams.get('uid');
    this.taskimg = '';

	}

  private camOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 700,
    targetHeight:700,
  };

	ionViewDidLoad() {
		// nothing
	}
  addImg(){
    this.camera.getPicture(this.camOptions).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.taskimg = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }
  rmImg(){
    this.taskimg = '';
  }
	addTask(): void {
		if(this.taskname) {
			this.totoProvider.addTodo(this.listUID, this.taskname || "???", false, this.taskdesc || "", this.taskimg || '');
			this.navCtrl.pop();
		}
	}

	returnPrecPage(): void {
		this.navCtrl.pop();
	}
}
