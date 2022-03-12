import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import {  ModalController, PopoverController } from '@ionic/angular';
import { ZonasService } from '../../services/zonas.service';
import { RutaZonaService } from '../../services/ruta-zona.service';
import { MarcadoresPage } from '../marcadores/marcadores.page';
import { RutasService } from 'src/app/services/rutas.service';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { ServiciosCompartidosService } from 'src/app/services/servicios-compartidos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { PlanificacionRutasService } from '../../services/planificacion-rutas.service';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { Clientes } from '../../models/clientes';
import { BusquedaMapaPage } from '../busqueda-mapa/busqueda-mapa.page';

interface Marcadores {
  select:boolean,
  id: string,
  cliente: any,
  modificado: boolean,
  nuevoCliente: boolean,
  color: string,
  nombre: string,
  latitud:number,
  longitud:number,
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}

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

@ViewChild('mapa') divMapa!:ElementRef;
zoomLevel: number = 12;
geocoderArray: any;
lngLat: [number, number] = [-84.12216755918627, 10.003022709670836];
marcadoresDuplicados : Marcadores [] = [];
marcadoresModificados : Marcadores [] = [];
marcadoresModal = []
clientesArray =[];
rutaZona= null;
drag = false;
modo = 'off'
mapa!: mapboxgl.Map;



    constructor(


      public modalCtrl: ModalController, 
 
      public zonas: ZonasService, 
      public rutas: RutasService, 
      public clienteEspejo: ClienteEspejoService , 
      public popOverCrtl: PopoverController, 
      public rutaZonas: RutaZonaService,
      public serviciosCompartidosService: ServiciosCompartidosService,
      public alertasService: AlertasService,
      public planificacionRutasService:PlanificacionRutasService
       
       
       ) {


    }



    ngOnInit(){

      this.planificacionRutasService.marcadores = [];
     // this.clientes.rutasClientes = [];
     // this.clientes.nuevosClientes = [];
    
    }

//============================================================================= 
// EL MAPA SE TIENE QUE INCIAR EN AFTER INIT POR SER UN VIEWCHILD 
//=============================================================================

   ngAfterViewInit() {

    this.createmapa(true)

   }



//============================================================================= 
// PROCESOS GENERALES DEL MODULO
//=============================================================================

          
//============================================================================= 
// MODAL GESTION DE LA LISTA DE RUTAS Y ZONAS A CONSULTAR
//=============================================================================

configuracionZonaRuta(){


  const rutaZona =  this.serviciosCompartidosService.listaRutasModal();

  rutaZona.then(valor =>{

        if(valor !== undefined){
        
          this.rutaZona = null;
      
          this.rutaZona = valor
           this.planificacionRutasService.rutaZona = null;
           this.planificacionRutasService.rutaZona = valor;
          this.alertasService.presentaLoading('Generando lista de clientes')

         const clientes =   this.clienteEspejo.syncRutas( this.rutaZona.Ruta);
        
         clientes.then((result) => {
           this.marcadoresDuplicados =[]
          this.clientesArray = [];
          this.planificacionRutasService.marcadores = []
       this.clientesArray = result;

         this.alertasService.loadingDissmiss();

        this.createmapa(false)

        this.agregarMarcadores(false)
        
      }).catch((err) => {

        this.alertasService.loadingDissmiss();

        let errorObject = {

          titulo: 'Insertar rutero',
          fecha: new Date(),
          metodo:'POST',
          url:err.url,
          message:err.message,
          rutaError:'app/services/planificacion-rutas-service.ts',
          json:null

        }


        this.planificacionRutasService.errorArray.push(errorObject)
        
      });
         }
      
       
      })
      
      }
//============================================================================= 
// NOS PERMITE AGREGAR NUEVOS CLIENTES AL MAPA
//=============================================================================


async menuCliente(){

  const modal = await this.modalCtrl.create({

    component: MenuClientesPage,
    componentProps:{
      rutaZona:this.rutaZona
    },

    cssClass: 'large-modal',

  });

  await modal.present();
  const { data } = await modal.onDidDismiss();

  if(data !=undefined){
    this.marcadoresDuplicados =[]
    this.clientesArray = [];
   let clientesNuevos: Clientes[]
        clientesNuevos = data.item
        this.clientesArray = clientesNuevos;
        this.createmapa(false)
        this.agregarMarcadores(true);
  
   

}
       
      }
    


//============================================================================= 
// MODAL GESTION DE ERRORES DE CADA UNO DE LOS PROCESOS INVOLUCRADOS 
//=============================================================================


gestionErrores(){

  this.alertasService.gestorErroresModal(this.planificacionRutasService.errorArray);
}



//============================================================================= 
// LIMPIAR EL MAPA Y ERRORES
//=============================================================================

    limpiarDatos(){
      this.drag = false;
      this.modo = ' off';
      this.rutaZona = null
      this.mapa.off('zoom', () => { });
      this.mapa.off('zoomend', () => { });
      this.mapa.off('move', () => { });
      this.planificacionRutasService.marcadores= [];
      this.createmapa(false);
      this.planificacionRutasService.errorArray = []

    }








//============================================================================= 
// PROCESOS MAPA
//=============================================================================



//============================================================================= 
// CREAR MAPA  EL DRAGGABLE ES PARA MOVER LOS PUNTOS DEL MAPA
//=============================================================================

 createmapa( dragable) {

  this.mapa   = new mapboxgl.Map({
        container: this.divMapa.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.lngLat,
        zoom: this.zoomLevel,
        interactive: true
      });
  
      const newMarker = new mapboxgl.Marker({ draggable: dragable })

        .setLngLat(this.lngLat)

        .addTo(this.mapa );

  
        this.mapa .addControl(new mapboxgl.NavigationControl());
        this.mapa .addControl(new mapboxgl.FullscreenControl());
        this.mapa .addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }));
  
      const geocoder= new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Buscar zona',
      })
  
      this.mapa .addControl(geocoder);
  
  
      geocoder.on('result', (e) => {
        console.log(e.result);
        this.geocoderArray = e.result
        this.busquedaMapa(e.result);
  
      })
  
  
      this.mapa .on('load', () => {

        this.mapa .resize();

      });

    }

    async busquedaMapa(resultadoBusqueda) {

      const modal = await this.modalCtrl.create({
        component: BusquedaMapaPage,
        cssClass: 'large-modal',
        componentProps: {
          data: resultadoBusqueda,
        }
      });
      if ( this.planificacionRutasService.marcadores.length > 0) {
        modal.present();


        const { data } = await modal.onDidDismiss();

        if (data !== undefined) {
          console.log(data)
          this.createmapa( false);

  this.marcadoresModificados = data.marcadores;
  console.log(this.planificacionRutasService.marcadores,'this.planificacionRutasService.marcadores')


  for(let i = 0; i < this.planificacionRutasService.marcadores.length; i++){
    const miniPopup = new  mapboxgl.Popup();

    this.planificacionRutasService.marcadores[i].marker.setLngLat([this.planificacionRutasService.marcadores[i].longitud,this.planificacionRutasService.marcadores[i].latitud]!)
    miniPopup.setText(this.planificacionRutasService.marcadores[i].id+' ' +  this.planificacionRutasService.marcadores[i].nombre)
    miniPopup.on('open', () => {
      this.detalleClientes(this.planificacionRutasService.marcadores[i].cliente)
    })

    this.planificacionRutasService.marcadores[i].marker.setPopup(miniPopup);
    this.planificacionRutasService.marcadores[i].marker.setLngLat([this.planificacionRutasService.marcadores[i].longitud,this.planificacionRutasService.marcadores[i].latitud]!)
    .addTo(this.mapa );
   

  }
  this.informacionMarcadores(this.marcadoresModificados,false)
       //   this.informacionMarcadores(this.marcadoresModificados,false)
        }
      }
  



  }
//============================================================================= 
// MUESTRA UNA LISTA CON LA INFORMACION DE LOS MARCADORES EN EL MAPA
//=============================================================================


    async informacionMarcadores(marcadores,duplicados) {

      const modal = await this.modalCtrl.create({
        component: MarcadoresPage,
        cssClass: 'auto-size-modal',
        componentProps:{
          marcadores: marcadores,
          duplicados: duplicados

        }

      });

      await modal.present();

     const {data} = await modal.onDidDismiss();

    if(data !=undefined){

       const item = data.item
console.log(item,'itemm')
const i = this.planificacionRutasService.marcadores.findIndex(marcador => marcador.id == item.id)
     if(i >=0){
      this.irMarcador( this.planificacionRutasService.marcadores[i].marker)
     }
       

    }else{

      this.createmapa(false);
      this.agregarMarcadoresExistentes(false)
    }
         }






// MUESTRA EL DETALLE DEL PUNTERO
//=============================================================================

async detalleClientes(cliente){

  const modal = await this.modalCtrl.create({
    component: DetalleClientesPage,
    cssClass: 'large-modal',
    componentProps:{
      detalleCliente: cliente
    }
  });
  await modal.present();



}









    
//============================================================================= 
// MODAL GESTION DE ERRORES DE CADA UNO DE LOS PROCESOS INVOLUCRADOS 
//=============================================================================


    irMarcador(marker: mapboxgl.Marker) {

      if (marker) {
        this.mapa.flyTo(
          { center: marker.getLngLat(), zoom: 18 }
        )
  
      }
    }
  
 //============================================================================= 
// PERMITE QUE LOS MARCADORES SE PUEDAN MOVER
//=============================================================================        

    dragMarcadores(){

      this.drag=!this.drag;
      if(this.drag === true){
       this.modo = 'on'
      }else{
        this.modo = 'off'
      }
    this.createmapa(this.drag) 
   

    
          this.agregarMarcadoresExistentes(this.drag)
         
      }
      agregarMarcadoresExistentes(draggable){

    
        for(let i =0; i < this.planificacionRutasService.marcadores.length ;i++)
      
        {
   
       if(!this.planificacionRutasService.marcadores[i].excluir){
        this.planificacionRutasService.marcadores[i].marker.setDraggable(draggable)
      
            
        const miniPopup = new  mapboxgl.Popup();
        const nombre = this.planificacionRutasService.marcadores[i].nombre;
        
      
          miniPopup.setText(this.planificacionRutasService.marcadores[i].cliente.IdCliente +' ' +  nombre)
      
          miniPopup.on('open', () => {
            console.log('popup was opened', this.planificacionRutasService.marcadores[i].cliente);
            this.detalleClientes(this.planificacionRutasService.marcadores[i].cliente)
          })
          this.planificacionRutasService.marcadores[i].marker.setPopup(miniPopup);
          this.planificacionRutasService.marcadores[i].marker.setLngLat([this.planificacionRutasService.marcadores[i].cliente.LONGITUD,this.planificacionRutasService.marcadores[i].cliente.LATITUD]!)
          this.planificacionRutasService.marcadores[i].marker.setPopup(miniPopup)
          .addTo(this.mapa);
        
          this.planificacionRutasService.marcadores[i].marker.on('dragend', () => {
          
            const index = this.planificacionRutasService.marcadores.findIndex(m => m.id === this.planificacionRutasService.marcadores[i].cliente.IdCliente);
      
            const { lng, lat } = this.planificacionRutasService.marcadores[i].marker!.getLngLat();
      
            this.planificacionRutasService.marcadores[i].cliente.LONGITUD = lng;
            this.planificacionRutasService.marcadores[i].cliente.LATITUD = lat;
      
      
            this.planificacionRutasService.marcadores[i].modificado = true;
            this.planificacionRutasService.marcadores[i].marker.setLngLat([lng, lat]);
         //   this.createmapa(this.divMapa,false, true);
            this.irMarcador(this.planificacionRutasService.marcadores[i].marker);
      
          })
       }
        
       }
    
    
      
      }
//============================================================================= 
// AGREGA LOS MARCADORES AL MAPA 
//=============================================================================

  agregarMarcadores(nuevoCliente:boolean){

console.log(this.clientesArray,'clientesArray')

    for(let i =0; i < this.clientesArray.length ;i++)
  
    {

      const centro: [number, number] = [this.clientesArray[i].LONGITUD,this.clientesArray[i].LATITUD];
  
      let marcador = {
        select:false,
        id: this.clientesArray[i].IdCliente,
        cliente: this.clientesArray[i],
        excluir: false,
        modificado: false,
        nuevoCliente: nuevoCliente,
        color: null,
        nombre: this.clientesArray[i].NOMBRE,
        marker: null,
        longitud: this.clientesArray[i].LONGITUD,
        latitud: this.clientesArray[i].LATITUD,
        centro: centro

      }
  
     const { newMarker , color } =  this.generarMarcadorColor();

     marcador.color = color;
     marcador.marker = newMarker;

     const m =  this.planificacionRutasService.marcadores.findIndex(marcador=> marcador.id == this.clientesArray[i].IdCliente)
 if( m >=0){
   this.marcadoresDuplicados.push(marcador)
   
  } else{
    
  this.planificacionRutasService.marcadores.push(marcador);
  



  }

  

  
   }
   for(let i = 0; i < this.planificacionRutasService.marcadores.length; i++){

    const pin = this.planificacionRutasService.marcadores[i];
  
    const miniPopup = new  mapboxgl.Popup();
  
    pin.marker.setLngLat([pin.longitud,pin.latitud]!)
    miniPopup.setText(pin.id+' ' +  pin.nombre)
    miniPopup.on('open', () => {
      this.detalleClientes(pin.cliente)
    })
  
    pin.marker.setPopup(miniPopup);
    pin.marker.setLngLat([pin.longitud,pin.latitud]!)
    .addTo(this.mapa );
  }
   console.log( this.planificacionRutasService.marcadores,'maeca')
   if(this.marcadoresDuplicados.length > 0){
     this.informacionMarcadores(this.marcadoresDuplicados,true)
   }
  }

//============================================================================= 
// GENERA UN COLOR ALEATORIO AL MARCADOR
//=============================================================================


generarMarcadorColor(){

  let color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
  
  const i =  this.planificacionRutasService.marcadores.findIndex(marcador => marcador.color === color);

  if(i >=0){
    this.generarMarcadorColor();
  }else{

    const newMarker = new mapboxgl.Marker({
      color:color,
      draggable: false

})

    return {newMarker , color}
  }

}

postRutas(){

  const postArray = [];

const exportarMarcadores =  this.planificacionRutasService.exportarMarcadores();
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

              
            if(exportarMarcadores[i].excluir){
              rutasClientes.Ruta = 'ND'
              rutasClientes.Zona = 'ND'

            }
            
              postArray.push(rutasClientes)
             
    
  }
  
  
  console.log(exportarMarcadores, 'exported array', 'post array', postArray)


  if(exportarMarcadores.length > 0){
console.log(postArray,'postArray')
this.clienteEspejo.insertarClienteEspejo(postArray);

  }
this.limpiarDatos();

 
}



}
