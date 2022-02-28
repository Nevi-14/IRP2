import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RutasPage } from '../rutas/rutas.page';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';

import { ZonasService } from '../../services/zonas.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { MapaService } from 'src/app/services/mapa.service';
import { RutaZonaService } from '../../services/ruta-zona.service';
import { MapboxGLService } from 'src/app/services/mapbox-gl.service';
import { MarcadoresPage } from '../marcadores/marcadores.page';
import { ClientesService } from 'src/app/services/clientes.service';

import { RutasService } from 'src/app/services/rutas.service';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { ServiciosCompartidosService } from 'src/app/services/servicios-compartidos.service';



@Component({
  selector: 'app-planificacion-rutas',
  templateUrl: './planificacion-rutas.page.html',
  styleUrls: ['./planificacion-rutas.page.scss'],
  styles: [
    `
  
    #mapa {
      height:100%;
     width:100%;
  
    }

    `
  ]
})
export class PlanificacionRutasPage implements OnInit, AfterViewInit {





  rutaZona= null;
  drag = false;
  
  modo = 'off'
  @ViewChild('mapa') divMapa!:ElementRef;

    constructor(
      public global: GlobalService,
      public modalCtrl: ModalController, 
      public alertCtrl: AlertController, 
      public clientes: ClientesService, 
      public zonas: ZonasService, 
      public rutas: RutasService, 
      public clienteEspejo: ClienteEspejoService , 
      route:ActivatedRoute, 
      public popOverCrtl: PopoverController, 
      public mapa: MapaService, 
      public rutaZonas: RutaZonaService,
       public mapboxLgService: MapboxGLService,
       public serviciosCompartidosService: ServiciosCompartidosService
       
       
       ) {


    }



    ngOnInit(){

     this.clientes.rutasClientes = [];
     this.clientes.nuevosClientes = [];
     this.mapboxLgService.marcadores = [];
  console.log('planificacion Rutas')


    
    }
    ngAfterViewInit() {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.

      this.mapboxLgService.createmapa(this.divMapa,false, false)
      
    this.mapboxLgService.agregarMarcadores(this.clientes.rutasClientes,'NOMBRE','IdCliente',false)
    }
         
    limpiarDatos(){
      this.rutaZona = null
      this.mapboxLgService.reset();
    }

    async informacionMarcadores(evento) {

      const modal = await this.modalCtrl.create({
        component: MarcadoresPage,
        cssClass: 'auto-size-modal',
        componentProps:{
          marcadores: this.mapboxLgService.marcadores,
        }
       // backdropDismiss:false
      });
      
      await modal.present();
    
    }


    postRutas(){

      const postArray = [];

    const exportarMarcadores =  this.mapboxLgService.exportarMarcadores();
    //  this.clienteEspejo.presentaLoading('Guardando Rutas...');
      for(let i =0; i < exportarMarcadores.length; i++){

        const rutasClientes = {
          IdCliente:exportarMarcadores[i].id,
          Fecha: new Date().toISOString(),
          Usuario: 'IRP',
          Zona: this.rutaZona.Zona ,
          Ruta:this.rutaZona.Ruta   ,
          Latitud: exportarMarcadores[i].cliente.LATITUD,
          Longitud: exportarMarcadores[i].cliente.LONGITUD
                  }
                
                  postArray.push(rutasClientes)
        
      }
      
      
      console.log(exportarMarcadores, 'exported array', 'post array', postArray)


      if(exportarMarcadores.length > 0){
  
      this.clienteEspejo.insertarClienteEspejo(postArray);

      }else{
       
        this.global.message('Planificacion Rutas','No se efectuaron cambios');
      }
      this.mapboxLgService.marcadores = []
      this.rutaZona= null
      this.clientes.rutasClientes = [];
      this.clientes.nuevosClientes = [];
      this.drag=false;
      this.modo = 'off'
      this.mapboxLgService.createmapa(this.divMapa,false, false)

     
    }

    
            
    dragMarcadores(){
      this.drag=!this.drag;
      if(this.drag === true){
this.modo = 'on'
      }else{
        this.modo = 'off'
      }
      
      this.mapboxLgService.createmapa(this.divMapa,false, false)
      this.mapboxLgService.draggMarkers(this.mapboxLgService.marcadores, this.drag)
    }


    busquedaCliente(){

    }

    configuracionZonaRuta(){
      const valorRetorno =  this.serviciosCompartidosService.listaRutasModal();
      
      valorRetorno.then(valor =>{
      
        if(valor !== undefined){
        
          this.rutaZona = null;
      
          this.rutaZona = valor
         
          this.clienteEspejo.syncRutas( this.rutaZona.Ruta);
        
      
         }
      
       
      })
      
      }

async configuracionZonaRuta2(evento) {

 

  const popover = await this.popOverCrtl.create({
    component: RutasPage,
    cssClass: 'menu-map-popOver',
    event: evento,
    translucent: true,
    mode:'ios',
  });

   popover.present();


  const { data } = await popover.onDidDismiss();

    if(data !== undefined && data.ruta != ''){
      
      const i = this.rutaZona.rutasZonasArray.findIndex( r => r.Ruta === data.ruta );
    
   
      if ( i >= 0 ){
        const  z = this.zonas.zonas.findIndex( z => z.ZONA === this.rutaZona.rutasZonasArray[i].Zona);
         //  this.rutaZona.rutaID = this.rutaZona.rutasZonasArray[i].Ruta;
           //this.rutaZonaData.ruta =this.rutaZona.rutasZonasArray[i].Descripcion;
           //this.rutaZonaData.zonaId =  this.zonas.zonas[z].ZONA;
           //this.rutaZonaData.zona = this.zonas.zonas[z].NOMBRE;

           //this.clienteEspejo.syncRutas( this.rutaZonaData.rutaID);
        
         }  
  
  
  
      //this.map.leerMarcador([{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes}]);
  
    }



} 

async menuCliente(){

  const modal = await this.modalCtrl.create({
    component: MenuClientesPage,
    cssClass: 'large-modal'
  });
   await modal.present();

       
      }
    

}
