import { ElementRef, Injectable, ViewChild } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { BusquedaMapaPage } from '../pages/busqueda-mapa/busqueda-mapa.page';
import { ModalController, LoadingController } from '@ionic/angular';
import { ClientesService } from './clientes.service';
import { AlertasService } from './alertas.service';
import { ServicioClienteService } from './servicio-cliente.service';

interface Marcadores {
  id: string,
  cliente: any,
  modificado: boolean,
  nuevoCliente: boolean,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}


@Injectable({
  providedIn: 'root'
})



export class ServicioClienteMapaService {
  divMapa!:ElementRef;
  result: any;
  mapa!: mapboxgl.Map;
  geocoder: any;
  zoomLevel: number = 12;
  array: any;
  lngLat: [number, number] = [-84.12216755918627, 10.003022709670836];
  marcadores: Marcadores[] = [];


  constructor(

    public clientes: ClientesService,
    public modalCtrl: ModalController,
    public logdingCtrl: LoadingController,
    public alertasService: AlertasService,
    public servicioClientesService: ServicioClienteService

    
  ) { }




  createmapa(mapa, dragable, reload) {

    this.divMapa = mapa
    const geojson = {
      'type': 'FeatureCollection',
      'features': [
      {
      'type': 'Feature',
      'properties': {
      'message': 'Foo',
      'iconSize': [60, 60]
      },
      'geometry': {
      'type': 'Point',
      'coordinates': [-66.324462, -16.024695]
      }
      },
      {
      'type': 'Feature',
      'properties': {
      'message': 'Bar',
      'iconSize': [50, 50]
      },
      'geometry': {
      'type': 'Point',
      'coordinates': [-61.21582, -15.971891]
      }
      },
      {
      'type': 'Feature',
      'properties': {
      'message': 'Baz',
      'iconSize': [40, 40]
      },
      'geometry': {
      'type': 'Point',
      'coordinates': [-63.292236, -18.281518]
      }
      }
      ]
    }
if(this.mapa){
  this.mapa.remove();
}

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom: this.zoomLevel,
      interactive: true
    });


    // Create a default Marker and add it to the map.
    const newMarker = new mapboxgl.Marker({ draggable: dragable })
      .setLngLat(this.lngLat)
      .addTo(this.mapa);
      for (const marker of geojson.features) {

        const newMarker = new mapboxgl.Marker({ draggable: dragable })
        .setLngLat(this.lngLat)
        .addTo(this.mapa);

        
        // Create a DOM element for each marker.
        const el = document.createElement('div');
        const width = 40;
        const height = 40;
        el.className = 'marker';
        el.style.backgroundImage = `url(assets/icons/delivery-truck.svg)`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
         
        el.addEventListener('click', () => {
        window.alert(marker.properties.message);
        });

        let   lngLat: [number, number] = [marker.geometry.coordinates[0],marker.geometry.coordinates[1]];
         
        // Add markers to the map.
        new mapboxgl.Marker(el)
        .setLngLat(lngLat)
        .addTo(this.mapa);



    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(new mapboxgl.FullscreenControl());
    this.mapa.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));


    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Buscar zona',
    })

    this.mapa.addControl(this.geocoder);





 

  }
  


  }

  
  agregarMarcadores2(arreglo:any[], columna:string, id:string, nuevoCliente: boolean){

    this.marcadores = []
console.log(arreglo,'marcadores 2')
    for(let i =0; i < arreglo.length ;i++)
  
    {
  
      
  const { newMarker , color } =  this.generarMarcadorColor(arreglo[i].estado);
  const miniPopup = new  mapboxgl.Popup();
  const nombre = arreglo[i][columna];

console.log(arreglo[i], 'arreglo[i]')
    newMarker.setLngLat([arreglo[i].longitud,arreglo[i].latitud]!)
    miniPopup.setText(arreglo[i][id] +' ' +  nombre)
    miniPopup.on('open', () => {
      console.log('popup was opened', arreglo[i]);
   
      this.servicioClientesService.detalleClientes(arreglo[i])
    })
    newMarker.setPopup(miniPopup);
    // newMarker.setLngLat([item.cliente.LONGITUD,item.cliente.LATITUD]!)
    newMarker.setLngLat([arreglo[i].longitud,arreglo[i].latitud]!)

    .addTo(this.mapa);

    newMarker.on('dragend', () => {
    
      const i = this.marcadores.findIndex(m => m.id === this.marcadores[i].cliente.IdCliente);

      const { lng, lat } = this.marcadores[i].marker!.getLngLat();


      this.marcadores[i].cliente.LONGITUD = lng;
      this.marcadores[i].cliente.LATITUD = lat;


      this.marcadores[i].modificado = true;
      this.marcadores[i].marker.setLngLat([lng, lat]);
      this.createmapa(this.divMapa,false, true);
     // this.irMarcador( this.marcadores[i].marker);

    })
  
   const marcador = {
  
    id:arreglo[i][id],
    cliente:arreglo[i],
    nombre:arreglo[i][columna],
    marker:newMarker,
    nuevoCliente: nuevoCliente,
    modificado: false,
    color:color
  
  }

    this.marcadores.push(marcador)

  
   }
  
  
  }

  generarMarcadorColor(estado){

    let color = null;
    let success = "#4BB543"
    let warning = "#EED202"
    let danger = "#FF0000"
    let dark = "#010203"
   switch(estado){
     case 'P':
  color = warning
     break;
  
     case 'I':
       color = danger
  
      break;
      case 'E':
        color = success
  
        default :
  
    
  
  
   }
    const i = this.marcadores.findIndex(marcador => marcador.color === color);
  
    const newMarker = new mapboxgl.Marker({
      color:color,
      draggable: false
  
  })
  
    return {newMarker , color}
  
  }
  
}
