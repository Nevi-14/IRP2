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
import { CalcularDitanciaRutaPage } from '../calcular-ditancia-ruta/calcular-ditancia-ruta.page';
import { ListaRutasZonasModalPage } from '../lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';

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
export class PlanificacionRutasPage implements OnInit, AfterViewInit {

@ViewChild('mapa') divMapa!:ElementRef;
default: any = 'title';
zoomLevel: number = 12;
geocoderArray: any;
lngLat: [number, number] = [-77.038659, 38.931567];
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

    this.createmapa()

   }



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
async listaRutasModal(){
    
  const modal = await this.modalCtrl.create({
    component: ListaRutasZonasModalPage,
    cssClass: 'large-modal',
  });
  modal.present();

  

  const { data } = await modal.onDidDismiss();


  if(data !== undefined){
    console.log(data.ruta, 'data retorno', data !== undefined)
    console.log(data)
  return data.ruta

  }else{

    this.limpiarDatos();
  }
}



configuracionZonaRuta(){


  const rutaZona =  this.listaRutasModal();

  rutaZona.then(valor =>{

this.features = []
        if(valor !== undefined){
        
          this.rutaZona = null;
      
          this.rutaZona = valor
           this.planificacionRutasService.rutaZona = null;
           this.planificacionRutasService.rutaZona = valor;
          this.alertasService.presentaLoading('Generando lista de clientes')

         const clientes =   this.clienteEspejo.syncRutas( this.rutaZona.Ruta);
        
         clientes.then((result) => {




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
        this.mapData(data.item, true)
        this.createmapa()
  //      this.agregarMarcadores(true);
  
   

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
      this.features = [];
      this.geocoderArray = [];
      this.planificacionRutasService.marcadores= [];
      this.createmapa();
      this.planificacionRutasService.errorArray = []

    }








//============================================================================= 
// PROCESOS MAPA
//=============================================================================



//============================================================================= 
// CREAR MAPA  EL DRAGGABLE ES PARA MOVER LOS PUNTOS DEL MAPA
//=============================================================================

 createmapa( ) {

  this.mapa   = new mapboxgl.Map({
        container: this.divMapa.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.lngLat,
        zoom: this.zoomLevel,
        interactive: true
      });
  
      const newMarker = new mapboxgl.Marker()
      .setLngLat(this.lngLat)
      .setPopup(new mapboxgl.Popup({closeOnClick: false, closeButton: false}).setText("DISTRIBUIDORA ISLEÑA"))
      .addTo(this.mapa)
      .togglePopup();
  
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
  

      const geojson: any = {
        'type': 'FeatureCollection',
        'features': this.planificacionRutasService.marcadores
        };


/**
 *         // add markers to map
for (const feature of geojson.features) {
   
const { newMarker , color } =  this.generarMarcadorColor( feature.properties.color)

feature.properties.color = color
feature.marker = newMarker
newMarker.setLngLat(feature.geometry.coordinates)
.addTo(this.mapa)

const miniPopup = new  mapboxgl.Popup();
miniPopup.setText(feature.title)
miniPopup.on('open', () => {
  this.detalleClientes(feature.properties.client)
})

newMarker.setPopup(miniPopup)

//.togglePopup();
}
 */
  
      this.mapa .on('load', () => {
        this.mapa.addSource('places', {
          // This GeoJSON contains features that include an "icon"
          // property. The value of the "icon" property corresponds
          // to an image in the Mapbox Streets style's sprite.
          'type': 'geojson',
          'data': {
          'type': 'FeatureCollection',
          'features': [
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
          'icon': 'theatre-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.038659, 38.931567]
          }
          },
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href="http://madmens5finale.eventbrite.com/" target="_blank" title="Opens in a new window">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>',
          'icon': 'theatre-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.003168, 38.894651]
          }
          },
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a <a href="http://tallulaeatbar.ticketleap.com/2012beachblanket/" target="_blank" title="Opens in a new window">Big Backyard Beach Bash and Wine Fest</a> on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.grill hot dogs.</p>',
          'icon': 'bar-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.090372, 38.881189]
          }
          },
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>Ballston Arts & Crafts Market</strong><p>The <a href="http://ballstonarts-craftsmarket.blogspot.com/" target="_blank" title="Opens in a new window">Ballston Arts & Crafts Market</a> sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>',
          'icon': 'art-gallery-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.111561, 38.882342]
          }
          },
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year\'s <a href="http://dandiesandquaintrelles.com/2012/04/the-seersucker-social-is-set-for-june-9th-save-the-date-and-start-planning-your-look/" target="_blank" title="Opens in a new window">Seersucker Social</a> bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>',
          'icon': 'bicycle-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.052477, 38.943951]
          }
          },
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>Capital Pride Parade</strong><p>The annual <a href="http://www.capitalpride.org/parade" target="_blank" title="Opens in a new window">Capital Pride Parade</a> makes its way through Dupont this Saturday. 4:30 p.m. Free.</p>',
          'icon': 'rocket-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.043444, 38.909664]
          }
          },
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist <a href="http://www.muhsinah.com" target="_blank" title="Opens in a new window">Muhsinah</a> plays the <a href="http://www.blackcatdc.com">Black Cat</a> (1811 14th Street NW) tonight with <a href="http://www.exitclov.com" target="_blank" title="Opens in a new window">Exit Clov</a> and <a href="http://godsilla.bandcamp.com" target="_blank" title="Opens in a new window">Gods’illa</a>. 9:00 p.m. $12.</p>',
          'icon': 'music-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.031706, 38.914581]
          }
          },
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>A Little Night Music</strong><p>The Arlington Players\' production of Stephen Sondheim\'s  <a href="http://www.thearlingtonplayers.org/drupal-6.20/node/4661/show" target="_blank" title="Opens in a new window"><em>A Little Night Music</em></a> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>',
          'icon': 'music-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.020945, 38.878241]
          }
          },
          {
          'type': 'Feature',
          'properties': {
          'description':
          '<strong>Truckeroo</strong><p><a href="http://www.truckeroodc.com/www/" target="_blank">Truckeroo</a> brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>',
          'icon': 'music-15'
          },
          'geometry': {
          'type': 'Point',
          'coordinates': [-77.007481, 38.876516]
          }
          }
          ]
          }
          });
        // Add a layer showing the places.
        this.mapa.addLayer({
  'id': 'places',
  'type': 'symbol',
  'source': 'places',
  'layout': {
  'icon-image': '{icon}',
  'icon-allow-overlap': true
  }
  });
   
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  this.mapa.on('click', 'places', (e) => {
  // Copy coordinates array.
  console.log( e.features[0]['geometry']['coordinates'])
  const coordinates = e.features[0]['geometry']['coordinates'];
  const description = e.features[0].properties.description;
   
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
   
  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(description)
  .addTo(this.mapa);
  });
   
  // Change the cursor to a pointer when the mouse is over the places layer.
  this.mapa.on('mouseenter', 'places', () => {
    this.mapa.getCanvas().style.cursor = 'pointer';
  });
   
  // Change it back to a pointer when it leaves.
  this.mapa.on('mouseleave', 'places', () => {
    this.mapa.getCanvas().style.cursor = '';
  });
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

    async calcDistance() {

      const modal = await this.modalCtrl.create({
        component: CalcularDitanciaRutaPage,
        cssClass: 'my-custom-modal',
        componentProps:{
          marcadores: this.features

        }

      });
      

      await modal.present();

     const {data} = await modal.onDidDismiss();
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
