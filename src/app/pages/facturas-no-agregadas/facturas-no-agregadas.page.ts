import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';
import { ClientesGuia } from '../../models/guia';


@Component({
  selector: 'app-facturas-no-agregadas',
  templateUrl: './facturas-no-agregadas.page.html',
  styleUrls: ['./facturas-no-agregadas.page.scss'],
})
export class FacturasNoAgregadasPage implements OnInit {
@Input() facturas:ClientesGuia[]
textoBuscar = '';
  constructor(
    public modalCtrl:ModalController
  ) { }

  ngOnInit(
  ) {
//this.facturas = this.controlCamionesService.importarFacturas(this.facturas);
    console.log('this.facturas', this.facturas)
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
