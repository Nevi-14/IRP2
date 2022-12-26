import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { ClientesGuia } from '../../models/guia';
import { PlanificacionEntregaClienteDetallePage } from '../planificacion-entrega-cliente-detalle/planificacion-entrega-cliente-detalle.page';

@Component({
  selector: 'app-planificacion-entrega-clientes',
  templateUrl: './planificacion-entrega-clientes.page.html',
  styleUrls: ['./planificacion-entrega-clientes.page.scss'],
})
export class PlanificacionEntregaClientesPage implements OnInit {
  textoBuscar = '';
  constructor(
public modalCtrl: ModalController,
public controlCamionesGuiasService: ControlCamionesGuiasService

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
    this.controlCamionesGuiasService.cargarMapa = true;
    if(cliente.seleccionado){
      cliente.seleccionado = false;

this.controlCamionesGuiasService.borrarCliente(cliente);
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
