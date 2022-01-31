import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import { RutasPage } from '../rutas/rutas.page';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import { AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { ConfiguracionRutaService } from '../../services/configuracionruta.service';
import { ZonasService } from '../../services/paginas/organizacion territorial/zonas.service';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';
import { ClientesService } from '../../services/paginas/clientes/clientes.service';
import { ClienteEspejoService } from '../../services/paginas/clientes/cliente-espejo.service';
import { MapService } from '../../services/componentes/mapas/map.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { MapaComponent } from 'src/app/components/mapa/mapa.component';
import { MapaService } from 'src/app/services/componentes/mapas/mapa.service';
import { RutaZonaService } from '../../services/paginas/rutas/ruta-zona.service';
import { MapboxGLService } from 'src/app/services/mapbox-gl.service';
import { MarcadoresPage } from '../marcadores/marcadores.page';



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
  rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  drag = false;
  
  modo = 'off'
  @ViewChild('mapa') divMapa!:ElementRef;
    constructor(public global: GlobalService,public modalCtrl: ModalController, public alertCtrl: AlertController, public config: ConfiguracionRutaService, public clientes: ClientesService, public zonas: ZonasService, public rutas: RutasService, public clienteEspejo: ClienteEspejoService, public map: MapService  , route:ActivatedRoute, public popOverCrtl: PopoverController, public mapa: MapaService, public rutaZona: RutaZonaService, public mapboxLgService: MapboxGLService) {


    }
  
    ngOnInit(){
     this.clientes.rutasClientes = [];
     this.clientes.nuevosClientes = [];
  console.log('planificacion Rutas')
    
    }
    ngAfterViewInit() {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.
      this.mapboxLgService.divMapa = this.divMapa;
      this.mapboxLgService.createmapa(false)
    }
         
    limpiarDatos(){
      this.rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
      this.mapboxLgService.reset();
    }

    async informacionMarcadores(evento) {

      const modal = await this.modalCtrl.create({
        component: MarcadoresPage,
        cssClass: 'medium-modal',
        componentProps:{
          marcadores: this.mapboxLgService.marcadores,
        }
       // backdropDismiss:false
      });
      
      await modal.present();
    
    }


    postRutas(){
      this.clienteEspejo.ClienteEspejoArray = [];

    //  this.clienteEspejo.presentaLoading('Guardando Rutas...');
      for(let i =0; i < this.mapboxLgService.marcadores.length; i++){

        const rutasClientes = {
          IdCliente:this.mapboxLgService.marcadores[i].id,
          Fecha: new Date().toISOString(),
          Usuario: 'IRP',
          Zona: this.rutaZonaData.zonaId ,
          Ruta:this.rutaZonaData.rutaID   ,
          Latitud: this.mapboxLgService.marcadores[i].cliente.LATITUD,
          Longitud: this.mapboxLgService.marcadores[i].cliente.LONGITUD
                  }
                  console.log(this.mapboxLgService.marcadores, 'post')
  
              /**
               *     if(this.mapboxLgService.marcadores[i].modificado || this.mapboxLgService.marcadores[i].nuevoCliente){
                    this.clienteEspejo.ClienteEspejoArray.push(rutasClientes)
                  }
               */
                  this.clienteEspejo.ClienteEspejoArray.push(rutasClientes) 
        
      }
      


      console.log(this.clienteEspejo.ClienteEspejoArray, 'cliente espejo con marcadores', this.clienteEspejo.ClienteEspejoArray.length)

      if(this.clienteEspejo.insertarClienteEspejo.length > 0){
        this.clienteEspejo.insertarClienteEspejo(this.clienteEspejo.ClienteEspejoArray);
        this.rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
        this.clientes.rutasClientes = [];
        this.clientes.nuevosClientes = [];
      }else{
        this.global.message('Planificacion Rutas','No se efectuaron cambios');
      }
      

     
    }

    
    
    dragMarcadores(){
      this.drag=!this.drag;
      if(this.drag === true){
this.modo = 'on'
      }else{
        this.modo = 'off'
      }

      this.mapboxLgService.createmapa(this.drag);
    }
async configuracionZonaRuta(evento) {

 

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
           this.rutaZonaData.rutaID = this.rutaZona.rutasZonasArray[i].Ruta;
           this.rutaZonaData.ruta =this.rutaZona.rutasZonasArray[i].Descripcion;
           this.rutaZonaData.zonaId =  this.zonas.zonas[z].ZONA;
           this.rutaZonaData.zona = this.zonas.zonas[z].NOMBRE;

           this.clienteEspejo.syncRutas( this.rutaZonaData.rutaID);
        
         }  
  
  
  
      //this.map.leerMarcador([{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes}]);
  
    }



} 

async menuCliente(){

  const modal = await this.modalCtrl.create({
    component: MenuClientesPage,
    cssClass: 'right-modal'
  });
   await modal.present();

       
      }
    

}
