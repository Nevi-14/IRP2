import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { PlanificacionEntregas } from '../../models/planificacionEntregas';
import { ControlCamionesGuiasService } from '../../services/control-camiones-guias.service';

@Component({
  selector: 'app-lista-clientes-guias',
  templateUrl: './lista-clientes-guias.page.html',
  styleUrls: ['./lista-clientes-guias.page.scss'],
})
export class ListaClientesGuiasPage implements OnInit {
@Input() facturas:PlanificacionEntregas[]=[];
@Input()rutaZona;
@Input() fecha;
verdadero = true;
image = '../assets/icons/delivery-truck.svg'
falso = false;
textoBuscar = '';
  constructor(
    public controlCamionesGuiasService: ControlCamionesGuiasService,
    public modalCtrl:ModalController
  ) { }

  ngOnInit() {
  }

  actualizarFactura(factura){
    this.modalCtrl.dismiss();
   // this.controlCamionesGuiasService.crearGuia(factura);
  }
  agregarGuia(factura){
    this.modalCtrl.dismiss();
    this.controlCamionesGuiasService.agregarGuia(factura);
  
    
  }
 removerFactura(factura){
  this.controlCamionesGuiasService.removerFactura(factura);

  if(this.controlCamionesGuiasService.guiaFacturasaActual.length == 0){
    this.modalCtrl.dismiss();
  }
 }
  eliminarCamionesFacturaIndividualAlert(factura){
   // this.controlCamionesGuiasService.eliminarCamionesFacturaIndividualAlert(factura)
    this.modalCtrl.dismiss();
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }
}
