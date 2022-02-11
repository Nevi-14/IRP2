import { Component, OnInit } from '@angular/core';
import { ActualizaFacturaGuiasService } from '../../services/actualiza-factura-guias.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-guias',
  templateUrl: './lista-guias.page.html',
  styleUrls: ['./lista-guias.page.scss'],
})
export class ListaGuiasPage implements OnInit {
  image = '../assets/icons/delivery-truck.svg'
  constructor(
public actualizaFacturaService: ActualizaFacturaGuiasService,
public modalCtrl: ModalController

  ) { }

  ngOnInit() {
  
  }

  actualizar(camion){

    this.modalCtrl.dismiss({

      camion:  camion
     });

  
  }

  cerrarModal(){
    this.modalCtrl.dismiss(); 
  }
}
