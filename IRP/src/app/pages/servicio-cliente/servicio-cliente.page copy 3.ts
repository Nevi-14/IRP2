import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ClientesService } from '../../services/clientes.service';
import { ZonasService } from '../../services/zonas.service';
import { RutasService } from '../../services/rutas.service';
import { ClienteEspejoService } from '../../services/cliente-espejo.service';
import { RutaZonaService } from '../../services/ruta-zona.service';

import { GuiasService } from 'src/app/services/guias.service';
import { GuiasRutaPage } from '../guias-ruta/guias-ruta.page';
import { RuteroService } from '../../services/rutero.service';
import { ServicioClienteMarcadoresPage } from '../servicio-cliente-marcadores/servicio-cliente-marcadores.page';
import { AlertasService } from 'src/app/services/alertas.service';
import { ServicioClienteService } from '../../services/servicio-cliente.service';
import { ClientesRutasPage } from '../clientes-rutas/clientes-rutas.page';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { HttpClient } from '@angular/common/http';
interface Marcadores {
  id: string,
  cliente: any,
  modificado: boolean,
  nuevoCliente: boolean,
  color: string,
  nombre: string,
  lngLat: any,
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}
var longLat = [
  [53.515333, -6.190796],
  [53.342686, -6.403656],
  [51.678091, -9.624023],
  [52.768293, -1.560059]
];

@Component({
  selector: 'app-servicio-cliente',
  templateUrl: './servicio-cliente.page.html',
  styleUrls: ['./servicio-cliente.page.scss'],
})
export class ServicioClientePage implements OnInit {


  featureCollection = [];


  rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  drag = false;
  guia  = null;  
  modo = 'off'
  @ViewChild('mapa') divMapa!:ElementRef;
  result: any;
  mapa!: mapboxgl.Map;
  draw: any;
  geocoder: any;
  zoomLevel: number = 12;
  array: any;
  lngLat: [number, number] = [-84.12216755918627, 10.003022709670836];
  marcadores: Marcadores[] = [];
  clientesArray = [];
    constructor(
      
      public modalCtrl: ModalController, 
      public alertCtrl: AlertController, 
      public clientes: ClientesService, 
      public zonas: ZonasService, 
      public rutas: RutasService, 
      public clienteEspejo: ClienteEspejoService , 
      public popOverCrtl: PopoverController, 
      public rutaZona: RutaZonaService, 
      public guiasService:GuiasService, 
      public ruteroService: RuteroService, 
      public alertasService: AlertasService,
      public servicioClienteService: ServicioClienteService,
      public http: HttpClient
      
      ) {


    }



    ngOnInit(){

     this.clientes.rutasClientes = [];
     this.clientes.nuevosClientes = [];

  console.log('planificacion Rutas')


    
    }

    //============================================================================= 
// MODAL GESTION DE ERRORES DE CADA UNO DE LOS PROCESOS INVOLUCRADOS 
//=============================================================================


gestionErrores(){

  this.alertasService.gestorErroresModal(this.servicioClienteService.errorArray);
}


    ngAfterViewInit() {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.

      this.createmapa()
      
    }
         
 
    async informacionMarcadores() {

      const modal = await this.modalCtrl.create({
        component: ServicioClienteMarcadoresPage,
        cssClass: 'auto-size-modal',
        componentProps:{
          marcadores: this.marcadores
        }
       // backdropDismiss:false
      });
      
      await modal.present();

      const {data} = await modal.onDidDismiss();
 
     if(data !=undefined){
 
        const item = data.item
 
        this.irMarcador(item)
        
 
     }
    
    }


    
            
 
async configuracionZonaRuta() {

  const modal = await this.modalCtrl.create({
    component: GuiasRutaPage,
    cssClass: 'large-modal'
  });
   await modal.present();



  const { data } = await modal.onDidDismiss();

    if(data !== undefined && data.idGuia != ''){
      
       console.log(data, 'return')

       this.guia = data
this.alertasService.presentaLoading('Cargando lista de clientes')
    const ruteros =   this.ruteroService.syncRutero(data.idGuia)
          ruteros.then(rutero =>{

  this.clientesArray = rutero;
this.createmapa();

this.alertasService.loadingDissmiss();

  
          }), error =>{
            this.alertasService.loadingDissmiss();
            let errorObject = {
              titulo: 'this.ruteroService.syncRutero(data.idGuia)',
              fecha: new Date(),
              metodo:'GET',
              url:error.url,
              message:error.message,
              rutaError:'app/services/rutero-service.ts',
              json:JSON.stringify(this.clientesArray)
            }
            this.servicioClienteService.errorArray.push(errorObject)
            
            console.log(error)
           
          }
      
       
    }



} 

createmapa() {

 

  this.mapa = new mapboxgl.Map({
    container: this.divMapa.nativeElement,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: this.lngLat,
    zoom: this.zoomLevel,
    interactive: true
  });


  // Create a default Marker and add it to the map.
  const newMarker = new mapboxgl.Marker({ draggable: true })
    .setLngLat(this.lngLat)
    .addTo(this.mapa);
 this.draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
      line_string: true,
      trash: true
  },
  styles: [
      // ACTIVE (being drawn)
      // line stroke
      {
          "id": "gl-draw-line",
          "type": "line",
          "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
          "layout": {
              "line-cap": "round",
              "line-join": "round"
          },
          "paint": {
              "line-color": "#3b9ddd",
              "line-dasharray": [0.2, 2],
              "line-width": 4,
              "line-opacity": 0.7
          }
      },
      // vertex point halos
      {
          "id": "gl-draw-polygon-and-line-vertex-halo-active",
          "type": "circle",
          "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
          "paint": {
              "circle-radius": 10,
              "circle-color": "#FFF"
          }
      },
      // vertex points
      {
          "id": "gl-draw-polygon-and-line-vertex-active",
          "type": "circle",
          "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
          "paint": {
              "circle-radius": 6,
              "circle-color": "#3b9ddd",
          }
      },
  ]
});
    
    // Add the draw tool to the map.
    this.mapa.addControl( this.draw);

     // add create, update, or delete actions
     this.mapa.on('draw.create', this.updateRoute);
     this.mapa.on('draw.update', this.updateRoute);
     this.mapa.on('draw.delete', this.removeRoute);

     
   // this.mapa.addControl(draw)
   let bounds: any  = [
    [-123.069003, 45.395273],
    [-122.303707, 45.612333]
  ];
 // this.mapa.setMaxBounds(bounds);
 var featureCollection = []; // Initialize empty collection

 // Your longLat collection


// for every item object within longLat



    this.mapa.on('load', () => {

      this.agregarMarcadores(this.clientesArray,'nombre','idCliente',false);



      this.mapa.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
        "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": this.featureCollection 
          }
        },
        "layout": {
          "icon-image": "{icon}-15",
          "text-field": "{title}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
        }
      });
      
      console.log(this.featureCollection,'this.featureCollection')

      this.mapa.resize();
     
    });
 
   

}

getRutas( URL){
  return this.http.get( URL );
}


getMatch(e) {
  var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + e
      +'?geometries=geojson&steps=true&access_token=' + mapboxgl.accessToken;
      alert([JSON.stringify(e), 'jsonResponse'])
      this.getRutas(url).subscribe( resp =>{
        var jsonResponse = resp
alert([JSON.stringify(resp), 'jsonResponse'])
   //     var coords = jsonResponse.routes[0].geometry;

       this.addRoute(e);
       console.log(e);

      })

}

updateRoute() {

  this.removeRoute(); // overwrite any existing layers
  var data = this.draw.getAll();
  var lastFeature = data.features.length - 1;
  var coords = data.features[lastFeature].geometry.coordinates;
  var newCoords = coords.join(';');
  alert('update')
  this.getMatch(newCoords);
}

addRoute (coords) {
  // check if the route is already loaded

  console.log(coords, 'marcaa')
  if (this.mapa.getSource('route')) {
    this.mapa.removeLayer('route');
    this.mapa.removeSource('route')
  } else{
    this.mapa.addLayer({
          "id": "route",
          "type": "line",
          "source": {
              "type": "geojson",
              "data": {
                  "type": "Feature",
                  "properties": {},
                  "geometry": coords
              }
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
          "paint": {
              "line-color": "#1db7dd",
              "line-width": 8,
              "line-opacity": 0.8
          }
      });
  };
}

// remove the layer if it exists
 removeRoute () {
  if (this.mapa.getSource('route')) {
    this.mapa.removeLayer('route');
    this.mapa.removeSource('route');
    
  } else  {
      return;
  }
}

agregarMarcadores(arreglo:any[], columna:string, id:string, nuevoCliente: boolean){

  this.marcadores = []
console.log(arreglo,'marcadores 2')
  for(let i =0; i < arreglo.length ;i++)

  {
   // Create a DOM element for each marker.
   const el = document.createElement('div');
   const width = 60;
   const height = 60;
   el.className = 'marker';
   el.style.backgroundImage = `url(assets/icons/shipped.svg)`;
   el.style.width = `${width}px`;
   el.style.height = `${height}px`;
   el.style.backgroundSize = '100%';
    
   el.addEventListener('click', () => {
   window.alert('La factura ya fue  entregada');
   });

   let   lngLat: [number, number] = [arreglo[i].longitud,arreglo[i].latitud];
    
if(arreglo[i].estado === 'I'){
     // Add markers to the map.
     new mapboxgl.Marker(el)
     .setLngLat(lngLat)
     .addTo(this.mapa);
}

    
const { newMarker , color } =  this.generarMarcadorColor(arreglo[i].estado);
const miniPopup = new  mapboxgl.Popup();
const nombre = arreglo[i][columna];

console.log(arreglo[i], 'arreglo[i]')
  newMarker.setLngLat([arreglo[i].longitud,arreglo[i].latitud]!)
  miniPopup.setText(arreglo[i][id] +' ' +  nombre)
  miniPopup.on('open', () => {
    console.log('popup was opened', arreglo[i]);
    if(arreglo[i].estado === 'I'){
      this.detalleClientes(arreglo[i], color, 'url(assets/icons/shipped.svg)')
    }else{
      this.detalleClientes(arreglo[i], color, null)
    }
   
  })
  const { lng, lat } = this.marcadores[i].marker!.getLngLat();

  this.featureCollection.push({
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates":lngLat
    },
    "properties": {
      "title": "Mapbox DC",
      "icon": "monument"
    }
  });
  newMarker.setPopup(miniPopup);
  // newMarker.setLngLat([item.cliente.LONGITUD,item.cliente.LATITUD]!)
  newMarker.setLngLat([arreglo[i].longitud,arreglo[i].latitud]!)

  .addTo(this.mapa);

 
  newMarker.on('dragend', () => {
  
    const i = this.marcadores.findIndex(m => m.id === this.marcadores[i].cliente.IdCliente);


    this.marcadores[i].cliente.LONGITUD = lng;
    this.marcadores[i].cliente.LATITUD = lat;


    this.marcadores[i].modificado = true;
    this.marcadores[i].marker.setLngLat([lng, lat]);
    this.createmapa();
   // this.irMarcador( this.marcadores[i].marker);

  })

 const marcador = {

  id:arreglo[i][id],
  cliente:arreglo[i],
  nombre:arreglo[i][columna],
  lngLat:[lng, lat],
  marker:newMarker,
  nuevoCliente: nuevoCliente,
  modificado: false,
  color:color

}

  this.marcadores.push(marcador)


 }

 console.log(this.featureCollection, 'this.featureCollection', this.marcadores, 'this.marcadores')

}
async detalleClientes(cliente, color , imagen){
  const modal = await this.modalCtrl.create({
    component: ClientesRutasPage,
    cssClass: 'extra-large-modal',
    componentProps:{
      cliente: cliente,
      color:color,
      imagen: imagen
    }
  });
  return await modal.present();
}
generarMarcadorColor(estado){

  let color = null;
  let primary = '#428cff';
  let success = "#4BB543"
  let warning = "#EED202"
  let danger = "#FF0000"
  let dark = "#010203"
 switch(estado){
   case 'P':
color = primary
   break;

   case 'I':
     color = warning

    break;
    case 'E':
      color = success
      break;
      case 'V':
        color = danger
        break;
      default :

  


 }
  const i = this.marcadores.findIndex(marcador => marcador.color === color);

  const newMarker = new mapboxgl.Marker({
    color:color,
    draggable: false

})

  return {newMarker , color}

}
irMarcador(marker: mapboxgl.Marker) {
  if (marker) {
    this.mapa.flyTo(
      { center: marker.getLngLat(), zoom: 18 }
    )

  }
}

refrescarVista(){

    const ruteros =   this.ruteroService.syncRutero(this.guia.idGuia)
          ruteros.then(rutero =>{

  this.clientesArray = rutero;
this.createmapa();


  
          }), error =>{
       
            let errorObject = {
              titulo: 'this.ruteroService.syncRutero(data.idGuia)',
              fecha: new Date(),
              metodo:'GET',
              url:error.url,
              message:error.message,
              rutaError:'app/services/rutero-service.ts',
              json:JSON.stringify(this.clientesArray)
            }
            this.servicioClienteService.errorArray.push(errorObject)
            
            console.log(error)
           
          }
}

limpiarDatos() {
  this.guia = null;
  this.rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  this.mapa.off('zoom', () => { });
  this.mapa.off('zoomend', () => { });
  this.mapa.off('move', () => { });
  this.clientesArray = []
  this.marcadores = [];
  this.createmapa();


}

}
