import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';

@Component({
  selector: 'app-menu-clientes',
  templateUrl: './menu-clientes.page.html',
  styleUrls: ['./menu-clientes.page.scss'],
})
export class MenuClientesPage implements OnInit {
  array = Array(20);
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  medClicked(event, item) {
  
  }
  
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  async detalleClientes(){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
