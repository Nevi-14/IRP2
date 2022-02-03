import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { CantonesService } from '../../services/paginas/organizacion territorial/cantones.service';
import { ProvinciasService } from '../../services/paginas/organizacion territorial/provincias.service';
import { DistritosService } from '../../services/paginas/organizacion territorial/distritos.service';
import { Clientes } from 'src/app/models/clientes';
import { NgForm } from '@angular/forms';
import { MapService } from 'src/app/services/componentes/mapas/map.service';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';
import { ClienteEspejoService } from 'src/app/services/paginas/clientes/cliente-espejo.service';
import { ZonasService } from 'src/app/services/paginas/organizacion territorial/zonas.service';
import { MapaService } from 'src/app/services/componentes/mapas/mapa.service';
import { MapboxGLService } from 'src/app/services/mapbox-gl.service';
import { BusquedaClienteService } from 'src/app/services/busqueda-cliente.service';
import { ClientesService } from 'src/app/services/paginas/clientes/clientes.service';

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
  @Input() mapa :any
  busqueda = false;
  clienteId : string;
  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public clientesService: ClientesService, public provincias: ProvinciasService, public cantones: CantonesService, public distritos: DistritosService, public zonas: ZonasService, public rutas: RutasService, public map: MapaService, public clienteEspejo: ClienteEspejoService, public MapboxGLService: MapboxGLService,public busquedaClienteService: BusquedaClienteService) { }


  onSearchChange(event){
    if(this.busqueda){
      this.busquedaClienteService.syncClientes(event.detail.value)
      this.borrarFiltro();
this.clientesService.clientesArray = [];
this.isChecked = !this.isChecked; 
    }else{
      if(this.clientesService.clientesArray.length == 1){
        this.clientesService.clientesArray = [];
      }
      this.textoBuscar = event.detail.value;
    }
    
  }
  onSearchChange2(){

   
    this.busquedaClienteService.syncClientes(this.clienteId)
    this.borrarFiltro();
this.clientesService.clientesArray = [];
this.isChecked = !this.isChecked; 
  }

  
  ngOnInit() {
    this.clientesService.isChecked = false;
    this.clientesService.clientes = [];
    this.clientesService.clientesArray = [];
  }

  checkAll(e){

    const isChecked = !e.currentTarget.checked;

   
    
    if(isChecked){
      for(let i =0; i < this.clientesService.clientesArray.length; i++) {
        console.log( i, 'select' , this.clientesService.clientesArray.length)
     this.clientesService.clientesArray[i].select  = true;

      }
     }else{
      for(let i =0; i < this.clientesService.clientesArray.length; i++) {
        this.clientesService.clientesArray[i].select  = false;
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
  for(let i = 0; i < this.clientesService.clientesArray.length;i++){
    if(this.clientesService.clientesArray[i].select === true){
      const duplicate = this.clientesService.rutasClientes.findIndex( d => d.IdCliente === this.clientesService.clientesArray[i].cliente.IdCliente );
      console.log('duplicate', duplicate)
      if ( duplicate >= 0 ){
        console.log('duplicate elements', this.clientesService.clientesArray[i].cliente.IdCliente)
        this.clientesService.clientesArray.splice(duplicate, 1);
        }else{
          
          this.clientesService.clientesRutas.push(this.clientesService.clientesArray[i]);
          this.clientesService.nuevosClientes.push(this.clientesService.clientesArray[i].cliente)
        }
       
         // this.map.createMap(-84.14123589305028,9.982628288210657);
     //    this.map.crearMapa(this.mapa, [{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes,nuevoCliente:true}], false, false);
     this.modalCtrl.dismiss();
         this.MapboxGLService.createmapa(false,false);
      
    }
  }
  this.message('IRP','Se agrego a la lista de RUTAS');



  }

  

  async onSubmit(){
 
this.clientesService.syncClientes(this.filtroClientes.Cod_Provincia,this.filtroClientes.Cod_Canton,this.filtroClientes.Cod_Distrito);
this.borrarFiltro();
this.clientesService.clientesArray = [];
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


