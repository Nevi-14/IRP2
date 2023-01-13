import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { ClientesGuia } from '../../models/guia';
import { PlanificacionEntregas } from '../../models/planificacionEntregas';

@Component({
  selector: 'app-planificacion-entrega-cliente-detalle',
  templateUrl: './planificacion-entrega-cliente-detalle.page.html',
  styleUrls: ['./planificacion-entrega-cliente-detalle.page.scss'],
})
export class PlanificacionEntregaClienteDetallePage implements OnInit {
@Input() cliente:ClientesGuia
todas:boolean = false;
  constructor(
public modalCtrl: ModalController,
public controlCamionesGuiasService: ControlCamionesGuiasService


) { }

  ngOnInit() {

    let count =   this.cliente.facturas.filter(f => f.SELECCIONADO == true);
  this.todas = count.length > 0 ? true : false;

  }



  cerrarModal(){
this.modalCtrl.dismiss();


  }

  todasLasFacturas(e){
    console.log('e', e)
    this.controlCamionesGuiasService.cargarMapa = true;
    if(e.detail.checked){

      this.cliente.seleccionado = true;
      this.cliente.facturas.forEach(factura =>{
        factura.SELECCIONADO = true;
       })
    }else{

      this.cliente.seleccionado = false;
      this.cliente.facturas.forEach(factura =>{
        factura.SELECCIONADO = false;
       })
    }

  }


  agregarFactura(factura:PlanificacionEntregas, e){
    this.controlCamionesGuiasService.cargarMapa = true;
    var statement = true;

 
    if(e.detail.checked      ){
 
      
    this.cliente.seleccionado = true;
    factura.SELECCIONADO = true;
    }else{
   
      factura.SELECCIONADO =  false;
      let count =   this.cliente.facturas.filter(f => f.SELECCIONADO == true);
      this.cliente.seleccionado = count.length > 0 ? true : false;
 

    }




  }
}
