import { Injectable } from '@angular/core';
import * as  Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment.prod';

import { ClientesService } from './clientes.service';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  mapa: Mapboxgl.Map;
  currentMarkers = [];
  constructor(private clientes: ClientesService) { }

  createMap(lng: number, lat: number){
    this.currentMarkers = [];
    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.mapa = new Mapboxgl.Map({
    container: 'mapa', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    //  MAPBOX  LNG , LAT AND GOOGLE MAPS IS LAT , LNG
    center: [lng,lat], // starting position
    zoom: 12 // starting zoom
    
    });

    this.mapa.on('load', () => {
      this.mapa.resize();
    });

    this.mapa.addControl(new Mapboxgl.NavigationControl());
    this.mapa.addControl(new Mapboxgl.FullscreenControl());
    this.mapa.addControl(new Mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));
    this.createMarker('01',lng,lat);

    for(let i =0;  i < this.clientes.rutasClientes.length; i++){
      console.log(this.clientes.rutasClientes[i].LONGITUD,this.clientes.rutasClientes[i].LATITUD)
        this.createMarker(this.clientes.rutasClientes[i].IdCliente,this.clientes.rutasClientes[i].LONGITUD,this.clientes.rutasClientes[i].LATITUD);
      }



    for(let i =0;  i < this.clientes.clientesRutas.length; i++){
      console.log(this.clientes.clientesRutas[i].IdCliente)
        this.createMarker(this.clientes.clientesRutas[i].cliente.IdCliente,this.clientes.clientesRutas[i].cliente.LONGITUD,this.clientes.clientesRutas[i].cliente.LATITUD);
      }

    
      
  }
  createMarker(cliente: string ,lng: number, lat: number){
    const marker = new Mapboxgl.Marker({
      draggable: false
      })
      .setLngLat([lng, lat])
      .addTo(this.mapa);
      this.currentMarkers.push({'id':cliente,'marker':marker});

 
/**
 *       marker.on('drag', () =>{
        console.log(marker.getLngLat());
     //   this.createMap(marker.getLngLat().lng,marker.getLngLat().lat);

      });
 */
      
      console.log('current markers',   this.currentMarkers);

  }


  removeMarker(cliente){
console.log('remove marker ', cliente)

for(let i = 0; i < this.currentMarkers.length; i++){

if(this.currentMarkers[i].id === cliente){
  console.log(this.currentMarkers[i].id , 'id curr' , cliente , 'cliente', 'position', i , 'removed' ,  this.currentMarkers.splice(i, 1))
  this.currentMarkers.splice(i, 1);
  this.createMap(-84.14123589305028,9.982628288210657);
}
}


 
}




irpMarcadorClientesRutas( i: number ){
  this.mapa.flyTo({
    center: [ this.clientes.rutasClientes[i].LONGITUD,  this.clientes.rutasClientes[i].LATITUD ],
    zoom: 16,
  });
}

  irpMarcador( i: number ){
    this.mapa.flyTo({
      center: [ this.clientes.clientesRutas[i].cliente.LONGITUD,  this.clientes.clientesRutas[i].cliente.LATITUD ],
      zoom: 16,
    });
  }
  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(resp => {
      console.log(resp)
      console.log(resp.coords.longitude,resp.coords.latitude);
  this.createMap(resp.coords.longitude,resp.coords.latitude);
    },
    err => {
      console.log(err);
    });
  }
  

}
