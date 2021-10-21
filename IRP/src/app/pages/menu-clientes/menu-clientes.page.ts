import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { ClientesService } from '../../services/clientes.service';
import { CantonesService } from '../../services/cantones.service';
import { ProvinciasService } from '../../services/provincias.service';
import { DistritosService } from '../../services/distritos.service';
import { Clientes } from 'src/app/models/clientes';
import { NgForm } from '@angular/forms';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';

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
  myvalue = 'ON';
  textoBuscar = '';
  isChecked = false;
  clientesArray = [];
  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private clientes: ClientesService, private provincias: ProvinciasService, private cantones: CantonesService, private distritos: DistritosService, private zonas: ZonasService, private rutas: RutasService) { }



  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }

  ngOnInit() {
    this.clientes.isChecked = false;
    this.clientes.clientes = [];
    this.clientes.clientesArray = [];


  }
  medClicked(event, item) {
  
  }
  checkAll(e){

    const isChecked = !e.currentTarget.checked;
    if(isChecked=== true){
      for(let i =0; i <= this.clientes.clientesArray.length; i++) {
        this.clientes.clientesArray[i].select  = true;
      }
     }else{
      for(let i =0; i <= this.clientes.clientesArray.length; i++) {
        this.clientes.clientesArray[i].select  = false;
      }
     }


   
 
 
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
  agregarCliente(){
  for(let i = 0; i < this.clientes.clientesArray.length;i++){
    if(this.clientes.clientesArray[i].select === true){
      this.clientes.clientesRutas.push(this.clientes.clientesArray[i]);
    }
  }

    this.message('IRP','Se agrego a la lista de RUTAS');
  }
  async onSubmit(formulario: NgForm){
this.clientes.syncClientes(this.filtroClientes.Cod_Provincia,this.filtroClientes.Cod_Canton,this.filtroClientes.Cod_Distrito);
this.borrarFiltro();
this.clientes.clientesArray = [];
this.isChecked = !this.isChecked; 
 
  }


  onChange($event , provincia, canton, distrito){
    if(provincia){
      this.filtroClientes.Cod_Provincia = $event.target.value;
      this.cantones.syncCantones(this.filtroClientes.Cod_Provincia);
    }else if(canton){
      this.filtroClientes.Cod_Canton = $event.target.value;
      this.distritos.syncDistritos(this.filtroClientes.Cod_Provincia, this.filtroClientes.Cod_Canton);
    }else{
      this.filtroClientes.Cod_Distrito = $event.target.value;
    }
    console.log($event.target.value);
    }

    borrarFiltro(){
      this.filtroClientes.Cod_Provincia = '';
      this.filtroClientes.Cod_Canton= '';
      this.filtroClientes.Cod_Distrito = '';
      
    }
    async  message(subtitle ,messageAlert){
    
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'ISLEÑA IRP',
        subHeader: subtitle,
        message: messageAlert,
        buttons: ['OK']
      });
  
      await alert.present();
  
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
 
  }


  myChange($event) {
    console.log('evento toggle',$event)
    if(this.myvalue === 'ON'){
      this.myvalue = 'OFF';
    }else{
      this.myvalue = 'ON';
    }
}

checkbox(){
  
}


}


