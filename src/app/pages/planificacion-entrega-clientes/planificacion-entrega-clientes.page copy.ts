import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { ClientesGuia } from '../../models/guia';

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

    if(cliente.seleccionado){

      this.modalCtrl.dismiss({
        agregar:false,
        borrar:true,
        redirigir:false,
        cliente:cliente
      })


    }else{

      this.modalCtrl.dismiss({
        agregar:true,
        borrar:false,
        redirigir:false,
        cliente:cliente
      })
    }

  }

  location(cliente){
    this.modalCtrl.dismiss({
      agregar:false,
      borrar:true,
      redirigir:false,
      cliente:cliente
    })


  }
}
