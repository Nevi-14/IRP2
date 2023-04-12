import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {  ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { Clientes } from 'src/app/models/clientes';
import { ListaRutasZonasModalPage } from '../lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import { BusquedaMapaPage } from '../busqueda-mapa/busqueda-mapa.page';
import { MarcadoresPage } from '../marcadores/marcadores.page';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { ConfiguracionesService } from '../../services/configuraciones.service';
import { ClientesService } from 'src/app/services/clientes.service';


interface Maradores2{
  title: string,
  color: string,
  new: boolean,
  modify:boolean,
  exclude:boolean,
  client:any,
  select : boolean
}
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
export class PlanificacionRutasPage  {

@ViewChild('mapa') divMapa!:ElementRef;
default: any = 'title';
zoomLevel: number = 12;
geocoderArray: any;
lngLat: [number, number] = [ this.configuracionesService.company.longitud, this.configuracionesService.company.latitud ];
marcadoresDuplicados : Marcadores [] = [];
marcadoresModificados : Marcadores [] = [];
marcadoresModal = []
clientesArray =[];
rutaZona= null;
drag = false;
modo = 'off'
mapa!: mapboxgl.Map;
features = [];


    constructor(


      public modalCtrl: ModalController, 
      public popOverCrtl: PopoverController, 
      public alertasService: AlertasService,
      public planificacionRutasService:PlanificacionRutasService,
      public configuracionesService: ConfiguracionesService,
      public clientesService: ClientesService
       
       
       ) {


    }


    ionViewWillEnter(){

      this.limpiarDatos();
    }
  


//============================================================================= 
// EL MAPA SE TIENE QUE INCIAR EN AFTER INIT POR SER UN VIEWCHILD 
//=============================================================================



//============================================================================= 
// PROCESOS GENERALES DEL MODULO
//=============================================================================

mapData(clientes:Clientes[], newClient){

  let newCount = 0;
  let duplicateCount = 0;


  this.planificacionRutasService.marcadores.forEach(client=>{

    client.duplicate = false;
 
  })
  

  clientes.forEach(cliente =>{
    const feature =    {
      id: cliente.IdCliente,
      title:  cliente.IdCliente +' '+cliente.NOMBRE,
      marker: null,
      select:false,
      modify: false,
      new: newClient,
      exclude:false,
      color: null,
      type: 'Feature',
      duplicate:false,
      geometry: {
        type: 'Point',
        coordinates: [cliente.LONGITUD, cliente.LATITUD]
      },
      properties: {
        client: cliente,
      }
    }

    
const index = this.planificacionRutasService.marcadores.findIndex(client => client.id == cliente.IdCliente)

    if( newClient  ){
     if(index >=0){
      duplicateCount += 1;
      this.planificacionRutasService.marcadores[index].duplicate = true;
     }else{
     
       newCount += 1;
       console.log('elseee',newCount)
      this.features.push(feature)
     }
    }else{
      this.features.push(feature)
    }
    
       
      })


   if(duplicateCount  > 0) {
        this.default = 'duplicate';
      this.informacionMarcadores(this.default );

     
   }else if(newCount  > 0){
    this.default = 'new';
    this.informacionMarcadores(this.default );

   
   }

      this.planificacionRutasService.marcadores = [];
      this.planificacionRutasService.marcadores = this.features;
      console.log( this.planificacionRutasService.marcadores,'marr')

}
          
//============================================================================= 
// MODAL GESTION DE LA LISTA DE RUTAS Y ZONAS A CONSULTAR
//=============================================================================
async configuracionZonaRuta(){
    
  const modal = await this.modalCtrl.create({
    component: ListaRutasZonasModalPage,
    cssClass: 'ui-modal',
    mode: 'ios',
  });
  modal.present();

  

  const { data } = await modal.onDidDismiss();
  console.log(data )

  if(data !== undefined){

    this.features = []
    if(data.rutas !== undefined){
    
      this.rutaZona = null;
      this.rutaZona = data.rutas[0]
 
      console.log(this.rutaZona ,'this.rutaZona ')

       this.planificacionRutasService.rutaZona = null;
       this.planificacionRutasService.rutaZona = this.rutaZona;
      this.alertasService.presentaLoading('Generando lista de clientes')

      this.clientesService.syncGetRutaCliente( this.rutaZona.RUTA).then((result) => {




this.mapData(result, false)





      
       this.marcadoresDuplicados =[]
      this.clientesArray = [];
    
   this.clientesArray = result;

     this.alertasService.loadingDissmiss();

    this.createmapa()

  //  this.agregarMarcadores(false)
    
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
  

  }else{

    this.limpiarDatos();
  }
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
        this.mapData(data.item, true)
        this.createmapa()
  //      this.agregarMarcadores(true);
  
   

}
       
      }
    

 


//============================================================================= 
// LIMPIAR EL MAPA Y ERRORES
//=============================================================================

    limpiarDatos(){

      this.drag = false;
      this.modo = ' off';
      this.rutaZona = null

      this.features = [];
      this.geocoderArray = [];
      
      this.planificacionRutasService.marcadores= [];
      this.planificacionRutasService.errorArray = []
      this.createmapa();
    }








//============================================================================= 
// PROCESOS MAPA
//=============================================================================



//============================================================================= 
// CREAR MAPA  EL DRAGGABLE ES PARA MOVER LOS PUNTOS DEL MAPA
//=============================================================================

 createmapa( ) {
if(this.mapa){
  this.mapa.remove();
  console.log('map removed', this.mapa)
}
  this.mapa   = new mapboxgl.Map({
        container: this.divMapa.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.lngLat,
        zoom: this.zoomLevel,
        interactive: true
      });
  
      const newMarker = new mapboxgl.Marker()
      .setLngLat(this.lngLat)
      .setPopup(new mapboxgl.Popup({closeOnClick: false, closeButton: false}).setText(this.configuracionesService.company.company))
      .addTo(this.mapa)
      .togglePopup();
  
        this.mapa.addControl(new mapboxgl.NavigationControl());
        this.mapa.addControl(new mapboxgl.FullscreenControl());
        this.mapa.addControl(new mapboxgl.GeolocateControl({
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
  

      const geojson: any = {
        'type': 'FeatureCollection',
        'features': this.planificacionRutasService.marcadores
        };


        // add markers to map
for (const feature of geojson.features) {
   
const { newMarker , color } =  this.generarMarcadorColor( feature.properties.color)

feature.properties.color = color
feature.marker = newMarker
newMarker.setLngLat(feature.geometry.coordinates)
.addTo(this.mapa)
const name = 'abc';


const divElement = document.createElement('div');
const assignBtn = document.createElement('div');
assignBtn.innerHTML = `

<ion-list> 
<ion-item>
<ion-button fill="clear" class="ion-text-wrap">
${feature.title + ' ' + feature.id}
</ion-button>
</ion-item>

</ion-list>
`;
divElement.appendChild(assignBtn);
// btn.className = 'btn';
assignBtn.addEventListener('click', (e) => {
this.detalleClientes(feature.properties.client)
});
newMarker.setPopup(new mapboxgl.Popup({offset: 32})
.setDOMContent(divElement))
    
newMarker.on('dragend', () => {

  const { lng, lat } = newMarker.getLngLat();
const i = this.planificacionRutasService.marcadores.findIndex(marcador => marcador.id == feature.id);

if(i >=0){
  this.planificacionRutasService.marcadores[i].properties.client.LONGITUD = lng;
  this.planificacionRutasService.marcadores[i].properties.client.LATITUD = lat;
  this.planificacionRutasService.marcadores[i].modify = true;
  this.planificacionRutasService.marcadores[i].marker.setLngLat([lng, lat]);
  this.planificacionRutasService.marcadores[i].geometry.coordinates = [lng, lat]

}

//   this.createmapa(this.divMapa,false, true);
  this.irMarcador(this.planificacionRutasService.marcadores[i].marker);

})
.addTo(this.mapa);

//.togglePopup();
}
  
      this.mapa.on('load', () => {

        
        this.mapa.resize();

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
          this.createmapa();

  this.marcadoresModificados = data.marcadores;
  console.log(this.planificacionRutasService.marcadores,'this.planificacionRutasService.marcadores')


  for(let i = 0; i < this.planificacionRutasService.marcadores.length; i++){
    const miniPopup = new  mapboxgl.Popup();

    this.planificacionRutasService.marcadores[i].marker.setLngLat([this.planificacionRutasService.marcadores[i].properties.client.LONGITUD,this.planificacionRutasService.marcadores[i].properties.client.LATIRUD]!)
    miniPopup.setText(this.planificacionRutasService.marcadores[i].title)
    miniPopup.on('open', () => {
      this.detalleClientes(this.planificacionRutasService.marcadores[i].properties.client)
    })

    this.planificacionRutasService.marcadores[i].marker.setPopup(miniPopup);
    this.planificacionRutasService.marcadores[i].marker.setLngLat([this.planificacionRutasService.marcadores[i].properties.client.LONGITUD,this.planificacionRutasService.marcadores[i].properties.client.LATITUD]!)
    .addTo(this.mapa );
   

  }
  this.informacionMarcadores('title' )
       //   this.informacionMarcadores(this.marcadoresModificados,false)
        }
      }
  



  }
//============================================================================= 
// MUESTRA UNA LISTA CON LA INFORMACION DE LOS MARCADORES EN EL MAPA
//=============================================================================


    async informacionMarcadores(defaultV) {
   
  
    
      const modal = await this.modalCtrl.create({
        component: MarcadoresPage,
        cssClass: 'my-custom-modal',
        componentProps:{
          default:defaultV
        }

      });
      

      await modal.present();

     const {data} = await modal.onDidDismiss();

    if(data !=undefined){

 
      this.irMarcador(  data.item)
 
       

    }   }

    





// MUESTRA EL DETALLE DEL PUNTERO
//=============================================================================

async detalleClientes(cliente){
console.log('clene',cliente)
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
this.planificacionRutasService.marcadores.forEach(marcadores => {
let pop = marcadores.marker.getPopup().remove()
console.log(pop,'pop')
})
if (marker) {
  this.mapa.flyTo(
    { center: marker.getLngLat(), zoom: 18 }
  )
marker.togglePopup();
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




    this.createmapa() 
   
         
      }



//============================================================================= 
// GENERA UN COLOR ALEATORIO AL MARCADOR
//=============================================================================


generarMarcadorColor( previousColor){

  let color =  null;

  let setColor = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
  
  const i =  this.features.findIndex(feature => feature.properties.color === setColor);

  if(i >=0){
    this.generarMarcadorColor(previousColor);

    return 

  }else{
     color =  previousColor != null ?  previousColor : setColor ;

    const newMarker = new mapboxgl.Marker({
      color: color,

      draggable: this.drag

})
    return {newMarker , color}
  }

}

postRutas(){

  const postArray = [];


for(let i =0; i < this.planificacionRutasService.marcadores.length; i ++){

  if( this.planificacionRutasService.marcadores[i].modify||  this.planificacionRutasService.marcadores[i].new){
    console.log(this.planificacionRutasService.marcadores[i],'this.planificacionRutasService.marcadores[i]')

    const rutasClientes = {
      IdCliente:this.planificacionRutasService.marcadores[i].id,
      Fecha: new Date().toISOString(),
      Usuario: 'IRP',
      Zona: 'ND',
      Ruta:this.rutaZona.RUTA   ,
      Latitud: this.planificacionRutasService.marcadores[i].properties.client.LATITUD,
      Longitud: this.planificacionRutasService.marcadores[i].properties.client.LONGITUD
              }

              if(this.planificacionRutasService.marcadores[i].exclude){
                rutasClientes.Ruta = 'ND'
                rutasClientes.Zona = 'ND'
  
              }


postArray.push(rutasClientes)

  }

  if(i == this.planificacionRutasService.marcadores.length -1){

    console.log(postArray,'postArray')
    this.clientesService.syncPostClienteEspejo(postArray);
    this.limpiarDatos();
  }
}

 
}



}
