import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';

@Component({
  selector: 'app-menu-clientes',
  templateUrl: './menu-clientes.page.html',
  styleUrls: ['./menu-clientes.page.scss'],
})
export class MenuClientesPage implements OnInit {
  textoBuscar = '';
  array = [
    { nombre:'Cliente 1'},
    { nombre:'Cliente 2'},
    { nombre:'Cliente 3'},
    { nombre:'Cliente 4'},
    { nombre:'Cliente 5'},
    { nombre:'Cliente 6'},
    { nombre:'Cliente 7'},
    { nombre:'Cliente 8'},
    { nombre:'Cliente 9'},
    { nombre:'Cliente 10'},
    { nombre:'Cliente 11'},
    { nombre:'Cliente 12'}
  ]
  constructor(private modalCtrl: ModalController) { }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }

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
