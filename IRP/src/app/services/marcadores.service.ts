import { Injectable, ViewChild, ElementRef } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';

interface Marcadores{
  id:string,
  cliente:any,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}

@Injectable({
  providedIn: 'root'
})


export class MarcadoresService {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  marcadores: Marcadores[]=[];
  zoomLevel: number = 10;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];

  constructor() { }





  leerMarcador(arreglo:any[], columna:string, id:string){
    this.marcadores = [];
    for(let i =0; i < arreglo.length ;i++)
  {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMarker= new mapboxgl.Marker({
      color:color,
      draggable: false
  
    })
    const miniPopup = new  mapboxgl.Popup();
    const nombre = arreglo[i][columna];
    miniPopup.setText(nombre)
    newMarker.setPopup(miniPopup);
    newMarker.setLngLat([arreglo[i].LONGITUD,arreglo[i].LATITUD]!)
    .addTo(this.mapa);

    this.marcadores.push({
      id:arreglo[i][id],
      cliente:arreglo[i],
      nombre:arreglo[i][columna],
      marker:newMarker,
      color:color
    })
  
  
  }  
  }



  irMarcador(marker: mapboxgl.Marker){
    this.mapa.flyTo(
      {center: marker.getLngLat(),zoom:18}
      )
    }



  
    borrarMarcador(i:number){
  this.marcadores[i].marker?.remove();
  this.marcadores.splice(i, 1);

    }
  


}
