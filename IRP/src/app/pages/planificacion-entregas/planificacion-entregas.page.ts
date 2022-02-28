import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';

import { DataTableService } from 'src/app/services/data-table.service';
import { CamionesGuiasService } from 'src/app/services/camiones-guias.service';
import { ServiciosCompartidosService } from 'src/app/services/servicios-compartidos.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { ListaCamionesModalPage } from '../lista-camiones-modal/lista-camiones-modal.page';
import { ListaGuiasModalPage } from '../lista-guias-modal/lista-guias-modal.page';
@Component({
  selector: 'app-planificacion-entregas',
  templateUrl: './planificacion-entregas.page.html',
  styleUrls: ['./planificacion-entregas.page.scss'],
})
export class PlanificacionEntregasPage implements OnInit {


  constructor(

    public modalCtrl: ModalController, 
    public rutas:RutasService, 
    public zonas:ZonasService, 
    public rutaFacturas: RutaFacturasService , 
    public popOverCrtl: PopoverController, 
    public rutaZonas: RutaZonaService,
    public actualizaFacturaGuiasService: CamionesGuiasService,
    public datableService: DataTableService,
    public serviciosCompartidosService: ServiciosCompartidosService,
    public planificacionEntregasService:PlanificacionEntregasService


  ) { }

// IMAGEN DEL BOTON DE CAMION

image = '../assets/icons/delivery-truck.svg'

// OBJETO QUE TIENE LA INFORMACION DE RUTA Y ZONA RUTA, ZONA, DESCRIPCION

rutaZona = null;

// VARIABLE TIPO STRING QUE RECIBE EL VALOR DE FECHA RETORNO DEL CALENDARIO

 fecha:string;

// VARIABLES VERDADERO FALSO UTILIZADAS PARA VALIDAR FRIO -  SECO

 verdadero = true;
 falso = false;



  ngOnInit() {
this.datableService.data = []
this.datableService.dataArrayToShow = []
this.planificacionEntregasService.bultosTotales = 0
this.planificacionEntregasService.clientesTotales = 0
this.planificacionEntregasService.pesoTotal = 0
this.planificacionEntregasService.fecha = null;
this.actualizaFacturaGuiasService.listaCamionesGuia = []
this.actualizaFacturaGuiasService.Fecha = null;
this.actualizaFacturaGuiasService.listaCamionesGuia = []
this.planificacionEntregasService.rutaFacturasArray = [];

 
  }


  loadData(){

    this.planificacionEntregasService.syncRutaFacturas( this.rutaZona.Ruta, this.fecha);
    
  }
  

  calendarioModal(){

   const valorRetorno = this.serviciosCompartidosService.calendarioModal('/');

   valorRetorno.then(valor =>{
    if(valor !== undefined){
 
      this.fecha = valor
   
   this.loadData();

     }

   
  })
}





generarPost(){
 this.actualizaFacturaGuiasService.generarPost()
this.rutaZona = null;
}

 



async listaCamiones(){
  const modal = await this.modalCtrl.create({
    component: ListaCamionesModalPage,
    cssClass: 'large-modal'
  });
  modal.present();
      
        
      
  const { data } = await modal.onDidDismiss();
console.log(data)
  if(data !== undefined){
  
this.actualizaFacturaGuiasService.agregarTodasFacturasUnicoCamion(this.rutaZona.Ruta, data.camion,  this.fecha);
      
  }else{

   
  
  }
  
}
removerGuia(consecutivo){
  this.actualizaFacturaGuiasService.removerGuia(consecutivo)
}
mostrarDetalleGuia(consecutivo){
  this.actualizaFacturaGuiasService.mostrarDetalleGuia(consecutivo, this.rutaZona, this.fecha)
}

agregarGuia(factura){
  this.actualizaFacturaGuiasService.agregarGuia(this.rutaZona.Ruta,  this.fecha, factura);

  
}


configuracionZonaRuta(){
const valorRetorno =  this.serviciosCompartidosService.listaRutasModal();

valorRetorno.then(valor =>{

  if(valor !== undefined){
  
    this.rutaZona = null;

    this.rutaZona = valor
   
    this.calendarioModal();


   }

 
})

}



 

}
