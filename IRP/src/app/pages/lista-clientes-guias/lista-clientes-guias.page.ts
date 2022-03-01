import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { CamionesGuiasService } from 'src/app/services/camiones-guias.service';
import { PlanificacionEntregas } from '../../models/planificacionEntregas';

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
    public actualizaFacturaGuiasService: CamionesGuiasService,
    public modalCtrl:ModalController
  ) { }

  ngOnInit() {
  }

  actualizarFactura(factura){
    this.modalCtrl.dismiss();
   // this.actualizaFacturaGuiasService.crearGuia(factura);
  }
  agregarGuia(factura){
    this.modalCtrl.dismiss();
    this.actualizaFacturaGuiasService.agregarGuia(this.rutaZona.Ruta,  this.fecha, factura);
  
    
  }
 removerFactura(factura){
  this.actualizaFacturaGuiasService.removerFactura(factura);

  if(this.actualizaFacturaGuiasService.guiaFacturasaActual.length == 0){
    this.modalCtrl.dismiss();
  }
 }
  eliminarCamionesFacturaIndividualAlert(factura){
   // this.actualizaFacturaGuiasService.eliminarCamionesFacturaIndividualAlert(factura)
    this.modalCtrl.dismiss();
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }
}
