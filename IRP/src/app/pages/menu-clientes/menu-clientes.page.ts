import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { ClientesService } from '../../services/clientes.service';
import { CantonesService } from '../../services/cantones.service';
import { ProvinciasService } from '../../services/provincias.service';
import { DistritosService } from '../../services/distritos.service';
import { Clientes } from 'src/app/models/clientes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-menu-clientes',
  templateUrl: './menu-clientes.page.html',
  styleUrls: ['./menu-clientes.page.scss'],
})
export class MenuClientesPage implements OnInit {
  filtroClientes = {
    Cod_Provincia : '',
    Cod_Canton : '',
    Cod_Distrito : '',
  }
  textoBuscar = '';
  constructor(private modalCtrl: ModalController, private clientes: ClientesService, private provincias: ProvinciasService, private cantones: CantonesService, private distritos: DistritosService) { }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }

  ngOnInit() {
    console.log(this.distritos.distritos);
  }
  medClicked(event, item) {
  
  }
  
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  async detalleClientes(cliente: any){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'my-custom-class',
      componentProps:{
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }
  agregarCliente(cliente: any){
    this.clientes.clientesRutas.push(cliente);
    console.log(this.clientes.clientesRutas)
  }
  async onSubmit(formulario: NgForm){
console.log(this.filtroClientes)
this.clientes.syncClientes(this.filtroClientes.Cod_Provincia,this.filtroClientes.Cod_Canton,this.filtroClientes.Cod_Distrito);
  }

  

  onChange($event , provincia, canton, distrito){
    if(provincia){
      this.filtroClientes.Cod_Provincia = $event.target.value;
    }else if(canton){
      this.filtroClientes.Cod_Canton = $event.target.value;
    }else{
      this.filtroClientes.Cod_Distrito = $event.target.value;
    }
    console.log($event.target.value);
    }

    borrarFiltro(){
      this.filtroClientes.Cod_Provincia = '';
      this.filtroClientes.Cod_Canton= '';
      this.filtroClientes.Cod_Distrito = '';
      this.clientes.syncClientes('1','01','04');
    }
}
