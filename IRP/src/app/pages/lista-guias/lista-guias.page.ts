import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { CamionesGuiasService } from 'src/app/services/camiones-guias.service';

@Component({
  selector: 'app-lista-guias',
  templateUrl: './lista-guias.page.html',
  styleUrls: ['./lista-guias.page.scss'],
})
export class ListaGuiasPage implements OnInit {
  image = '../assets/icons/delivery-truck.svg'
  textoBuscar = '';
  constructor(
    public actualizaFacturaGuiasService: CamionesGuiasService,
public modalCtrl: ModalController

  ) { }

  ngOnInit() {
    
  
  }

  actualizar(camion){

    this.modalCtrl.dismiss({

      camion:  camion
     });

  
  }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;

  }
  cerrarModal(){
    this.modalCtrl.dismiss(); 
  }
}
