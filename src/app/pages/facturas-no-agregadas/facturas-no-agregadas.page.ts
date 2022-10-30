import { Component, Input, OnInit } from '@angular/core';
import { PlanificacionEntregas } from '../../models/planificacionEntregas';
import { ModalController } from '@ionic/angular';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';

@Component({
  selector: 'app-facturas-no-agregadas',
  templateUrl: './facturas-no-agregadas.page.html',
  styleUrls: ['./facturas-no-agregadas.page.scss'],
})
export class FacturasNoAgregadasPage implements OnInit {
@Input() facturas:PlanificacionEntregas[]
textoBuscar = '';
  constructor(
    public modalCtrl:ModalController
  ) { }

  ngOnInit(
  ) {
  }


  cerrarModal(){

    this.modalCtrl.dismiss();
  }
  async agregarFacturas(){
this.cerrarModal();

    const modal = await this.modalCtrl.create({
      component: ControlFacturasPage,
      cssClass: 'large-modal',
      componentProps: {
        factura: null,
        facturas:this.facturas
      },
    });
    modal.present();

  }

  
  onSearchChange(event){
    this.textoBuscar = event.detail.value;
    
   }
}
