import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesGuia } from '../../models/guia';
import { PlanificacionEntregas } from '../../models/planificacionEntregas';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';

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
public planificacionEntregasService: PlanificacionEntregasService


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
    this.planificacionEntregasService.cargarMapa = true;
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
    this.planificacionEntregasService.cargarMapa = true;
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
