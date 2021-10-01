import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleClientesPage } from './pages/detalle-clientes/detalle-clientes.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  mapSvg = '../assets/home/map.svg';
  array = new Array(20);
  constructor( private modalCtrl: ModalController) {}

  async detalleClientes(){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  

}
