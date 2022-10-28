import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';

@Component({
  selector: 'app-lista-camiones-modal',
  templateUrl: './lista-camiones-modal.page.html',
  styleUrls: ['./lista-camiones-modal.page.scss'],
})

export class ListaCamionesModalPage implements OnInit {
  textoBuscar = '';
  myValue = false;
  constructor(
    public modalCtrl:ModalController,
    public gestionCamiones: GestionCamionesService,
  ) { }

  ngOnInit() {
    this.gestionCamiones.syncCamiones();
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
      }

    
      retornarCamion(camion){
    
        this.modalCtrl.dismiss({
    
          camion:  camion
         });

        }
        onSearchChange(event){
          this.textoBuscar = event.detail.value
            }
}
