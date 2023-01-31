import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
 
import { ClientesGuia } from '../../models/guia';
import { PlanificacionEntregaClienteDetallePage } from '../planificacion-entrega-cliente-detalle/planificacion-entrega-cliente-detalle.page';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';

@Component({
  selector: 'app-planificacion-entrega-clientes',
  templateUrl: './planificacion-entrega-clientes.page.html',
  styleUrls: ['./planificacion-entrega-clientes.page.scss'],
})
export class PlanificacionEntregaClientesPage implements OnInit {
  textoBuscar = '';
  constructor(
public modalCtrl: ModalController,
public planificacionEntregasService: PlanificacionEntregasService

  ) { }

  ngOnInit() {
  }

  cerrarModal(){

    this.modalCtrl.dismiss();


  }
  onSearchChange($event){

this.textoBuscar = $event.detail.value;
  }

  borrarAgregarCliente(cliente:ClientesGuia){
    this.planificacionEntregasService.cargarMapa = true;
    if(cliente.seleccionado){
      cliente.seleccionado = false;

this.planificacionEntregasService.borrarCliente(cliente);
    }else{

      cliente.seleccionado  = true;
    }


  }

  async detalleClientes(cliente) {


    const modal = await this.modalCtrl.create({
      component: PlanificacionEntregaClienteDetallePage,
      cssClass: 'ui-modal',
      componentProps: {
        cliente: cliente
      }
    });
    return await modal.present();
  }
  location(cliente){
    this.modalCtrl.dismiss({
      cliente:cliente
    })


  }
}
