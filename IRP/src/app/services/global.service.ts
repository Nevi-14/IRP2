import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  

  mapMenu = false;
  fecha = new Date().toLocaleDateString();
  loading: HTMLIonLoadingElement;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }


// ALERTAS

  async alert(header, message){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
      {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
   async presentaLoading( mensaje: string ){
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
    });
    await this.loading.present();
  }

   loadingDissmiss(){
    this.loading.dismiss();
  }



  // MENSAJES

    
  async  message(header,message){ 
      
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: 'IRP',
      message: message,
      buttons: ['OK']
    });

    await alert.present();



}


}
