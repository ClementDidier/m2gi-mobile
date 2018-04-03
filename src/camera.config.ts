import { Camera, CameraOptions } from '@ionic-native/camera';
export const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.BASE64,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
}
