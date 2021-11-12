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
import { MapService } from '../../services/map.service';
import { ClienteEspejoService } from '../../services/cliente-espejo.service';

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
  myvalue = 'OFF';
  textoBuscar = '';
  isChecked = false;
  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private clientes: ClientesService, private provincias: ProvinciasService, private cantones: CantonesService, private distritos: DistritosService, private zonas: ZonasService, private rutas: RutasService, private map: MapService, private clienteEspejo: ClienteEspejoService) { }



  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }

  
  ngOnInit() {
    this.clientes.isChecked = false;
    this.clientes.clientes = [];
    this.clientes.clientesArray = [];
  }

  checkAll(e){

    const isChecked = !e.currentTarget.checked;

   
    
    if(isChecked){
      for(let i =0; i < this.clientes.clientesArray.length; i++) {
        console.log( i, 'select' , this.clientes.clientesArray.length)
     this.clientes.clientesArray[i].select  = true;

      }
     }else{
      for(let i =0; i < this.clientes.clientesArray.length; i++) {
        this.clientes.clientesArray[i].select  = false;
      }
     }


   
 
 
  }
  
  cerrarModal(){
    this.modalCtrl.dismiss({
    statement:true
    });
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
  async agregarCliente(){
  for(let i = 0; i < this.clientes.clientesArray.length;i++){
    if(this.clientes.clientesArray[i].select === true){
      const duplicate = this.clientes.rutasClientes.findIndex( d => d.IdCliente === this.clientes.clientesArray[i].cliente.IdCliente );
      console.log('duplicate', duplicate)
      if ( duplicate >= 0 ){
        console.log('duplicate elements', this.clientes.clientesArray[i].cliente.IdCliente)
        this.clientes.clientesArray.splice(duplicate, 1);
        }else{
          this.clientes.clientesRutas.push(this.clientes.clientesArray[i]);
        }
       
         // this.map.createMap(-84.14123589305028,9.982628288210657);


    }
  }
  this.message('IRP','Se agrego a la lista de RUTAS');



  }
  async onSubmit(formulario: NgForm){
    this.clientes.presentaLoading('Cargando clientes');
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
      this.modalCtrl.dismiss({
        statement:true
      });
 
  }


  myChange($event) {
    console.log('evento toggle',$event)
    if(this.myvalue === 'OFF'){
      this.myvalue = 'ON';
    }else{
      this.myvalue = 'OFF';
    }
}




}


