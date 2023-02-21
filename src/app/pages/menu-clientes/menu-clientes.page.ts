import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { ClientesService } from 'src/app/services/clientes.service';
import { AlertasService } from '../../services/alertas.service';
import { PlanificacionRutasService } from '../../services/planificacion-rutas.service';
import { ProvinciasCantonesDistritosService } from 'src/app/services/provincias-cantones-distritos.service';


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
  @Input() rutaZona :any
  busqueda = false;
  clientesArray = [];

  constructor(

    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public clientesService: ClientesService, 
    public aslertasService: AlertasService,
    public planificacionRutasService: PlanificacionRutasService,
    public provinciasCantonesDistritosService:ProvinciasCantonesDistritosService
    
    
    
    ) { }


  onSearchChange(event){

if(this.busqueda){

this.clientesService.getClienteID(event.detail.value)
   
this.borrarFiltro();
this.clientesArray = [];
this.isChecked = !this.isChecked; 


    }else{

      if(this.clientesArray.length == 1){

        this.clientesArray = [];

      }

      this.textoBuscar = event.detail.value;
    }
    
  }


  
  ngOnInit() {
    this.clientesService.isChecked = false;
    this.clientesService.clientes = [];
    this.clientesService.clientesArray = [];
    if(this.provinciasCantonesDistritosService.provincias.length == 0){
      this.provinciasCantonesDistritosService.syncProvincias()
      }
    }
  

  checkAll(e){

    const isChecked = !e.currentTarget.checked;

   
    
    if(isChecked){
      for(let i =0; i <  this.clientesService.clientesArray.length; i++) {
        console.log( i, this.clientesService.clientesArray , this.clientesService.clientesArray.length)
        this.clientesService.clientesArray[i].select  = true;

      }
     }else{
      for(let i =0; i < this.clientesService.clientesArray.length; i++) {
        this.clientesService.clientesArray[i].select  = false;
      }
     }


   
 
 
  }
  
  cerrarModal(){
    this.modalCtrl.dismiss();
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


this.modalCtrl.dismiss({

  'item': checkedArray

});


  }

  

  async onSubmit(){
this.aslertasService.presentaLoading('Cargando lista de clientes')
 this.clientesService.syncClientes(

   this.filtroClientes.Cod_Provincia,
   this.filtroClientes.Cod_Canton,
   this.filtroClientes.Cod_Distrito

   
   ).then((result) => {
    this.clientesService.clientesArray = [];
this.aslertasService.loadingDissmiss();
this.clientesService.clientesArray  = result;
   console.log(this.clientesArray,'happ')
 }).catch((err) => {
  this.aslertasService.loadingDissmiss();
 });
this.borrarFiltro();
this.clientesService.clientesArray = [];
this.isChecked = !this.isChecked; 

 
  }


  onChange($event , provincia, canton, distrito){
    if(provincia){
      this.filtroClientes.Cod_Provincia = $event.target.value;
      this.provinciasCantonesDistritosService.syncCantones(this.filtroClientes.Cod_Provincia);
    }else if(canton){
      this.filtroClientes.Cod_Canton = $event.target.value;
      this.provinciasCantonesDistritosService.syncDistritos(this.filtroClientes.Cod_Provincia, this.filtroClientes.Cod_Canton);
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


