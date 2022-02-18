import { ElementRef, Injectable, ViewChild } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { BusquedaMapaPage } from '../pages/busqueda-mapa/busqueda-mapa.page';
import { ModalController, LoadingController } from '@ionic/angular';
import { ClientesService } from './clientes.service';
import { AlertasService } from './alertas.service';

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



export class MapboxGLService {
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
    public alertasService: AlertasService

    
  ) { }




  createmapa(mapa, dragable, reload) {

    this.divMapa = mapa

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




    this.geocoder.on('result', (e) => {
      console.log(e.result);
      this.array = e.result
      //this.busquedaMapa(e.result,element, marcadores,dragable,reload);

      this.busquedaMapa(e.result);
      console.log(this.array)


    })


    this.mapa.on('load', () => {
      this.mapa.resize();
    });


    this.agregarMarcadoresExistentes();


  }
  
  agregarMarcadorNuevosRegistros(arreglo:any[], columna:string, id:string){

    console.log(arreglo, 'arregloooo')
    for(let i =0; i < arreglo.length ;i++)
   
    {

     
  
   const duplicate = this.marcadores.findIndex(marcador => marcador.id === arreglo[i].cliente.IdCliente);

   if(duplicate < 0 ){
    const { newMarker , color } =  this.generarMarcadorColor();
    const miniPopup = new  mapboxgl.Popup();
    const nombre = arreglo[i][columna];
    miniPopup.setText(nombre)
    newMarker.setPopup(miniPopup);
    newMarker.setLngLat([arreglo[i].LONGITUD,arreglo[i].LATITUD]!)
    .addTo(this.mapa);
  
  
   const marcador = {
  
    id:arreglo[i].cliente.IdCliente,
    cliente:arreglo[i].cliente,
    nombre:arreglo[i][columna],
    marker:newMarker,
    nuevoCliente: true,
    modificado: false,
    color:color
  
  }
    this.marcadores.push(marcador)
  
    console.log('new record inserted')
   }
    
    }  
  
    this.createmapa( this.divMapa,false, true);
  
    
    }

  agregarMarcadores(arreglo:any[], columna:string, id:string, nuevoCliente: boolean){

    this.marcadores = []

    for(let i =0; i < arreglo.length ;i++)
  
    {
  
  const { newMarker , color } =  this.generarMarcadorColor();
  const miniPopup = new  mapboxgl.Popup();
  const nombre = arreglo[i][columna];


    newMarker.setLngLat([arreglo[i].LONGITUD,arreglo[i].LATITUD]!)
    miniPopup.setText(arreglo[i][id] +' ' +  nombre)
    miniPopup.on('open', () => {
      console.log('popup was opened', arreglo[i]);
   
      this.clientes.switchModaldetalle('planificacion-rutas', arreglo[i])
    })
    newMarker.setPopup(miniPopup);
    // newMarker.setLngLat([item.cliente.LONGITUD,item.cliente.LATITUD]!)
    newMarker.setLngLat([arreglo[i].LONGITUD,arreglo[i].LATITUD]!)

    .addTo(this.mapa);

    newMarker.on('dragend', () => {
    
      const i = this.marcadores.findIndex(m => m.id === this.marcadores[i].cliente.IdCliente);

      const { lng, lat } = this.marcadores[i].marker!.getLngLat();


      this.marcadores[i].cliente.LONGITUD = lng;
      this.marcadores[i].cliente.LATITUD = lat;


      this.marcadores[i].modificado = true;
      this.marcadores[i].marker.setLngLat([lng, lat]);
      this.createmapa(this.divMapa,false, true);
      this.irMarcador( this.marcadores[i].marker);

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


  agregarMarcadoresExistentes(){

    
    for(let i =0; i < this.marcadores.length ;i++)
  
    {

   
  const miniPopup = new  mapboxgl.Popup();
  const nombre =  this.marcadores[i].nombre;
  

    miniPopup.setText(this.marcadores[i].cliente.IdCliente +' ' +  nombre)

    miniPopup.on('open', () => {
      console.log('popup was opened', this.marcadores[i].cliente);
      this.clientes.switchModaldetalle('planificacion-rutas', this.marcadores[i].cliente)
    })
    this.marcadores[i].marker.setPopup(miniPopup);
    this.marcadores[i].marker.setLngLat([this.marcadores[i].cliente.LONGITUD,this.marcadores[i].cliente.LATITUD]!)
    this.marcadores[i].marker.setPopup(miniPopup)
    .addTo(this.mapa);
  
    this.marcadores[i].marker.on('dragend', () => {
    
      const index = this.marcadores.findIndex(m => m.id === this.marcadores[i].cliente.IdCliente);

      const { lng, lat } = this.marcadores[i].marker!.getLngLat();

      this.marcadores[i].cliente.LONGITUD = lng;
      this.marcadores[i].cliente.LATITUD = lat;


      this.marcadores[i].modificado = true;
      this.marcadores[i].marker.setLngLat([lng, lat]);
      this.createmapa(this.divMapa,false, true);
      this.irMarcador( this.marcadores[i].marker);

    })
    
   }


  
  }


  
// GENERA UN NUEVO MARCADOR - COLOR


generarMarcadorColor(){

  let color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
  
  const i = this.marcadores.findIndex(marcador => marcador.color === color);

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



  async busquedaMapa(resultadoBusqueda) {

      const modal = await this.modalCtrl.create({
        component: BusquedaMapaPage,
        cssClass: 'large-modal',
        componentProps: {
          data: resultadoBusqueda
        }
      });
      if (this.marcadores.length > 0) {
        modal.present();


        const { data } = await modal.onDidDismiss();

        if (data !== undefined) {
          console.log(data)
          this.createmapa( this.divMapa,false, true);
        }
      }
  



  }

  irMarcador(marker: mapboxgl.Marker) {
    if (marker) {
      this.mapa.flyTo(
        { center: marker.getLngLat(), zoom: 18 }
      )

    }
  }


  reset() {
    this.mapa.off('zoom', () => { });
    this.mapa.off('zoomend', () => { });
    this.mapa.off('move', () => { });
    this.clientes.rutasClientes = []
    this.marcadores = [];
    this.createmapa( this.divMapa,false, false);
    console.log(this.marcadores, 'mark')

  }


  draggMarkers(array:Marcadores[], draggable){

  array.forEach(marcador => {
    const newMarker = new mapboxgl.Marker({
      color:marcador.color,
      draggable: draggable 

    })

    marcador.marker = newMarker

      })

      this.createmapa( this.divMapa,false, false);

  }
  
  

  exportarMarcadores(){

    const marcadoresExportar = [];
    
        for(let i = 0; i < this.marcadores.length; i ++){     
    
          if(this.marcadores[i].modificado  || this.marcadores[i].nuevoCliente){
    
           marcadoresExportar.push(this.marcadores[i])

          }
    
        }
    
        this.marcadores = [];

      return marcadoresExportar;
      }
    
 
  actualizarMarcador(id){

    for(let i = 0; i < this.marcadores.length; i ++){     

      if(this.marcadores[i].id === id){
        this.marcadores[i].modificado = true;
      }

    }
    
  }




}
