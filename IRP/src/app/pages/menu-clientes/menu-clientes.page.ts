import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { CantonesService } from '../../services/cantones.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { MapboxGLService } from 'src/app/services/mapbox-gl.service';
import { BusquedaClienteService } from 'src/app/services/busqueda-cliente.service';
import { DistritosService } from 'src/app/services/distritos.service';
import { RutasService } from 'src/app/services/rutas.service';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';


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
  clientesArray = [];
  constructor(
    public modalCtrl: ModalController, public alertCtrl: AlertController, public clientesService: ClientesService, public provincias: ProvinciasService, public cantones: CantonesService, public distritos: DistritosService, public zonas: ZonasService, public rutas: RutasService, public clienteEspejo: ClienteEspejoService, public MapboxGLService: MapboxGLService,public busquedaClienteService: BusquedaClienteService) { }


  onSearchChange(event){
    if(this.busqueda){

      this.busquedaClienteService.generateArrayFromComaSeparated(event.detail.value)
     // this.busquedaClienteService.syncClientes(event.detail.value)
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
      cssClass: 'large-modal',
      componentProps:{
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }
  async agregarCliente(){
const checkedArray = [];

this.clientesService.clientesArray.forEach(cliente =>{


  if(cliente.select){
    checkedArray.push(cliente)
  }
})
    this.MapboxGLService.agregarMarcadorNuevosRegistros(checkedArray,'NOMBRE','IdCliente');
/**
 *   for(let i = 0; i < this.clientesService.clientesArray.length;i++){
    const clienteExistenteDuplicado = this.clientesService.rutasClientes.findIndex( d => d.IdCliente === this.clientesService.clientesArray[i].cliente.IdCliente );
    const clienteNuevoDuplicado = this.clientesService.nuevosClientes.findIndex( d => d.IdCliente === this.clientesService.clientesArray[i].cliente.IdCliente );
    if ( clienteExistenteDuplicado >= 0){ 
        this.clientesService.clientesArray.splice(clienteExistenteDuplicado, 1);
    }else if ( clienteNuevoDuplicado >=0){
      this.clientesService.nuevosClientes.splice(clienteNuevoDuplicado, 1);
    }
    console.log(this.clientesService.clientesArray[i])
    if(this.clientesService.clientesArray[i].select){
      this.clientesService.nuevosClientes.push(this.clientesService.clientesArray[i].cliente)
    }
 
  }
 */
  this.message('IRP','Se agrego a la lista de RUTAS');
  this.modalCtrl.dismiss();
  this.MapboxGLService.createmapa(this.MapboxGLService.divMapa,false,false);


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


