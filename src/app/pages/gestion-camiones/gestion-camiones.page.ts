import { Component, OnInit } from '@angular/core';
import { Camiones } from 'src/app/models/camiones';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { ModalController } from '@ionic/angular';
import { AgregarActualizarCamionPage } from '../agregar-actualizar-camion/agregar-actualizar-camion.page';

@Component({
  selector: 'app-gestion-camiones',
  templateUrl: './gestion-camiones.page.html',
  styleUrls: ['./gestion-camiones.page.scss'],
})
export class GestionCamionesPage implements OnInit {
  snow = '<ion-icon name="snow-outline"></ion-icon>'
  sun = '<ion-icon name="sun-outline"></ion-icon>'
  textoBuscarRuta = ''
  abrirModal = false;
 
  constructor(
public camionesService: GestionCamionesService,
public modalCtrl: ModalController

  ) { }

  ngOnInit() {

    this.camionesService.syncCamiones();
  }
  onSearchChange(event){

    console.log(event.detail.value);

    this.textoBuscarRuta = event.detail.value;

  }

  async detalleCamion(camion?:Camiones) {
    this.abrirModal = true;
    const modal = await this.modalCtrl.create({
      component: AgregarActualizarCamionPage,
      cssClass: 'ui-modal',
      backdropDismiss: false,
      swipeToClose: false,  
      mode: 'ios',
   componentProps : {
    editarCamion: camion ? camion : null
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
