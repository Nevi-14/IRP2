import { Component, OnInit, Input } from '@angular/core';

import { AlertController, ModalController } from '@ionic/angular';

import { PlanificacionEntregas } from '../../models/planificacionEntregas';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';
import { ClientesGuia } from '../../models/guia';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
interface cliente {
  id: number,
  idGuia:string,
  cliente: string,
  latitud: number,
  longitud:number,
  distancia: number,
  duracion:number,
  direccion:string,
  bultosTotales:number,
  orden_visita: number,
  HoraInicio:Date,
  HoraFin:Date
}

 

//=============================================================================
// INTERFACE DE  MODELO GUIA DE ENTREGA
//=============================================================================

interface  Guias{

  idGuia: string,
  verificada:boolean,
  guiaExistente:boolean,
  zona: string,
  ruta: string,
  fecha: string,
  numClientes: number,
  totalFacturas:number
  distancia: number,
  duracion:number
  camion:{
    HoraInicio:string,
    HoraFin:string,
    chofer:string,  
    idCamion: string,
    capacidad: number,
    pesoRestante: number,
    peso: number,
    estado: string,
    HH: string,
    volumen: number,
    frio:string,
    seco:string
  }
  clientes:cliente[],
  facturas: PlanificacionEntregas[]
}
@Component({
  selector: 'app-lista-clientes-guias',
  templateUrl: './lista-clientes-guias.page.html',
  styleUrls: ['./lista-clientes-guias.page.scss'],
})
export class ListaClientesGuiasPage implements OnInit {
  textoBuscarClientes= '';
@Input()rutaZona;
@Input() fecha;
@Input()  idGuia
@Input()  guia:Guias
@Input() clientes:ClientesGuia[]=[];
verdadero = true;
image = '../assets/icons/delivery-truck.svg'
falso = false;
  constructor(
    public modalCtrl:ModalController,
    public alertCTrl: AlertController,
    public planificacionEntregsService: PlanificacionEntregasService
  ) { }

  ngOnInit() {
    console.log( this.guia,'guiia')
  //this.clientes =   this.controlCamionesGuiasService.importarFacturas(this.guia.facturas);
  console.log( this.clientes,'clientes')
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

 borrarFacturaGuia(cliente:ClientesGuia, factura, i){
this.planificacionEntregsService.borrarFacturaGuia(factura);
cliente.facturas.splice(i, 1);
  if(cliente.facturas.length  == 0){
  let c = this.clientes.findIndex(cli => cli.id == cliente.id);
  if(c => 0){
    this.clientes.splice(c, 1);
    if(this.clientes.length == 0) this.cerrarModal();
  }

  };

 }
  eliminarCamionesFacturaIndividualAlert(factura){
   // this.controlCamionesGuiasService.eliminarCamionesFacturaIndividualAlert(factura)
    this.modalCtrl.dismiss();
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  onSearchChange(event){

    this.textoBuscarClientes = event.detail.value;
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
      if(this.planificacionEntregsService.listaGuias.length == 0){
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
