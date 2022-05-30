import { Component, OnInit, Input } from '@angular/core';

import { AlertController, ModalController } from '@ionic/angular';

import { PlanificacionEntregas } from '../../models/planificacionEntregas';
import { ControlCamionesGuiasService } from '../../services/control-camiones-guias.service';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';

@Component({
  selector: 'app-lista-clientes-guias',
  templateUrl: './lista-clientes-guias.page.html',
  styleUrls: ['./lista-clientes-guias.page.scss'],
})
export class ListaClientesGuiasPage implements OnInit {
@Input() facturas:any[]
@Input()rutaZona;
@Input() fecha;
@Input()  idGuia
@Input()  guia:any
verdadero = true;
image = '../assets/icons/delivery-truck.svg'
falso = false;
textoBuscar = '';
  constructor(
    public controlCamionesGuiasService: ControlCamionesGuiasService,
    public modalCtrl:ModalController,
    public alertCTrl: AlertController
  ) { }

  ngOnInit() {
   console.log( this.facturas, this.guia,'guiia')
  }

  actualizarFactura(factura){
    this.modalCtrl.dismiss();
   // this.controlCamionesGuiasService.crearGuia(factura);
  }
  agregarGuia(factura){
    this.modalCtrl.dismiss();
   // this.controlCamionesGuiasService.agregarGuia(factura);
  
    
  }
 removerFactura(factura){
/**
 *   this.controlCamionesGuiasService.removerFactura(factura);

  if(this.controlCamionesGuiasService.guiaFacturasaActual.length == 0){
    this.modalCtrl.dismiss();
  }
 */
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

  async onOpenMenuGuias(factura) {
  
    let inputArray:any = []
  
  let agregar :any =          {
  name: 'radio1',
  type: 'radio',
  label: 'Mover a otra guia',
  value: 'value1',
  handler: () => {
    console.log('Radio 1 selected');
  
    this.alertCTrl.dismiss();
  }
  }
  


    
  let eliminar :any =     {
  name: 'radio2',
  type: 'radio',
  label: 'Eliminar Factura',
  value: 'value2',
  handler: () => {
    console.log('Radio 2 selected');
  
  this.alertCTrl.dismiss();
  }
  }
  
  
  
  inputArray.push(agregar,eliminar)
  
  
    const alert = await this.alertCTrl.create({
      cssClass: 'my-custom-class',
      header: 'Administrar Guias',
      message: `
      Te permite gestionar todas las facturas disponibles ya sea para mover todas las facturas a una nueva guia, guia existente en estado INI o eliminar todas las guias 
  `,
      inputs: inputArray,
    });
  
    await alert.present();
  }

  async controlFacturas(factura){


    const modal = await this.modalCtrl.create({
      component: ControlFacturasPage,
      cssClass: 'large-modal',
      componentProps:{
        factura:factura
      },id:'control-facturas'
    });
  
    modal.present();
        
          
    const { data } = await modal.onDidDismiss();
  
    if(data !== undefined){
      if(this.controlCamionesGuiasService.listaGuias.length == 0){
        this.modalCtrl.dismiss(null,null,'detalle-guia');
      }
      console.log(data, 'data')
    //  this.controlCamionesGuiasService.generarGuia(factura, data.camion);
  //=============================================================================
  // UNA VEZ QUE OBTENEMOS LA INFORMACION DEL CAMION PROCEDEMOS A AGREGAR TODAS
  // LAS FACTURAS A UNA SOLA GUIA
  //=============================================================================
   
   
  
        
    }
   
  
  }


}
