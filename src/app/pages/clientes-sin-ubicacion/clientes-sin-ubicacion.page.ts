import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActualizaClientes } from 'src/app/models/actualizaClientes';
import { ActualizaClientesService } from 'src/app/services/actualiza-clientes.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';

@Component({
  selector: 'app-clientes-sin-ubicacion',
  templateUrl: './clientes-sin-ubicacion.page.html',
  styleUrls: ['./clientes-sin-ubicacion.page.scss'],
})
export class ClientesSinUbicacionPage implements OnInit {
clientes:ActualizaClientes[]=[]
textoBuscar = '';
  constructor(
 public modalCtrl:ModalController,
 public actualizaClintesService:ActualizaClientesService,
 public clientesService:ClientesService   
  ) { }

 async  ngOnInit() {
    this.clientes = await this.actualizaClintesService.syncGetActualizaClientes();
    let ids = [];
       for(let i = 0; i < this.clientes.length; i++){
        ids.push(this.clientes[i].ID_CLIENTE)
        if(i == this.clientes.length -1){
    
      this.clientesService.getClienteID(ids.toString())
     
        }
       }
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }


  async detalleClientes(cliente: any) {
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'ui-modal',
      componentProps: {
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }
  onSearchChange(event) {
    this.textoBuscar = event.detail.value;
  }
  async agregarClientes() {

    const checkedArray = [];

    this.clientesService.clientesArray.forEach(cliente => {


      if (cliente.seleccionado) {
        checkedArray.push(cliente)
      }
    })


    this.modalCtrl.dismiss({

      'item': checkedArray

    });


  }

  checkAll(e) {

    const isChecked = !e.currentTarget.checked;



    if (isChecked) {
      for (let i = 0; i < this.clientesService.clientesArray.length; i++) {
        console.log(i, this.clientesService.clientesArray, this.clientesService.clientesArray.length)
        this.clientesService.clientesArray[i].seleccionado = true;

      }
    } else {
      for (let i = 0; i < this.clientesService.clientesArray.length; i++) {
        this.clientesService.clientesArray[i].seleccionado = false;
      }
    }





  }
}
