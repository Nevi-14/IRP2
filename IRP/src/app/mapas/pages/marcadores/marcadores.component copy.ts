import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}



@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
 
    ion-list{
      position: fixed;
      top: 60px;
      right: 30px;
      z-index: 99999;
      max-height:200px;
      max-width:300px;
      overflow: hidden;
      overflow-y: auto;
      ::-webkit-scrollbar {
        display: none;
      }
    }
 
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
  // Arreglo de marcadores
  @Input() markers:any;
  marcadores: MarcadorColor[]=[];
  @Input() height: string;
  constructor() { }

  ngAfterViewInit(){
    this.mapa = new mapboxgl.Map({
      container:this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom:10,
      interactive: true
      });
  
      new mapboxgl.Marker()
      .setLngLat(this.center)
      .addTo(this.mapa);   
      
      this.mapa.on('load', () => {
        this.mapa.resize();
      });
   }
  









  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
 const nuevoMarcador = new mapboxgl.Marker(
   {draggable:true,color}
 )
 .setLngLat(this.center)
 .addTo(this.mapa)

 this.marcadores.push({color, marker: nuevoMarcador});
 this.guardarMarcadoresLocalStorage();

 nuevoMarcador.on('dragend', ()=>{
this.guardarMarcadoresLocalStorage();
})
  }

  irMarcador(marker: mapboxgl.Marker){
  this.mapa.flyTo(
    {center: marker.getLngLat()}
    )
  }

  guardarMarcadoresLocalStorage(){
    const lngLatArr: MarcadorColor[]=[];
    this.marcadores.forEach(m =>{
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      lngLatArr.push({
        color:color,
       // marker:  m.marker,
        centro: [lng, lat]}
        );
      
    })
    
    console.log('mar', lngLatArr)
  localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
 
  }

  leerLocalStorage(){
if(!localStorage.getItem('marcadores')){
  return
}
const lngLatArr : MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
console.log('marcadores local storage',lngLatArr);
lngLatArr.forEach(m=> {
  const newMarker= new mapboxgl.Marker({
    color:m.color,
    draggable: true

  }).setLngLat(m.centro!)
  .addTo(this.mapa);

  this.marcadores.push({
    marker:newMarker,
    color:m.color
  })

  newMarker.on('dragend', ()=>{
    console.log('dragged')
    this.guardarMarcadoresLocalStorage();
  })
})
  }


  borrarMarcador(i:number){
this.marcadores[i].marker?.remove();
this.marcadores.splice(i, 1);
this.guardarMarcadoresLocalStorage();
  }

leerMarcador(){


  this.markers.forEach(m=> {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMarker= new mapboxgl.Marker({
      color:color,
      draggable: true
  
    }).setLngLat([m.LONGITUD,m.LATITUD]!)
    .addTo(this.mapa);
  
    this.marcadores.push({
      marker:newMarker,
      color:m.color
    })
  
    newMarker.on('dragend', ()=>{
      console.log('dragged')
    })
  })
}
 
}
