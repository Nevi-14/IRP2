import { Component, OnInit } from '@angular/core';
import { GestionTelefonosService } from 'src/app/services/gestion-telefonos.service';
import { ModalController } from '@ionic/angular';
import { AgregarActualizarTelefonoPage } from '../agregar-actualizar-telefono/agregar-actualizar-telefono.page';

@Component({
  selector: 'app-gestion-telefonos',
  templateUrl: './gestion-telefonos.page.html',
  styleUrls: ['./gestion-telefonos.page.scss'],
})
export class GestionTelefonosPage implements OnInit {
  textoBuscarTelfono = '';
  abrirModal = false;
  constructor(
   public telefonosService: GestionTelefonosService,
   public modalCtrl:ModalController 
  ) { }

  ngOnInit() {

    this.telefonosService.syncTelefonos();
  }
  onSearchChange(event){

    console.log(event.detail.value);

    this.textoBuscarTelfono = event.detail.value;

  }

  async detalleTelefono(telefono?:any) {
    this.abrirModal = true;
    const modal = await this.modalCtrl.create({
      component: AgregarActualizarTelefonoPage,
      cssClass: 'ui-modal',
      backdropDismiss: false,
      swipeToClose: false,
      mode: 'ios',
      componentProps : {
      editarTelefono: telefono ? telefono : null
      }
    });
    if (this.abrirModal) {
      modal.present();
    }

    const { data } = await modal.onDidDismiss();
    this.abrirModal = false;
    if (data !== undefined) {
      

    }
  }
}
