import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';
import { ClienteEspejoService } from '../../../../services/paginas/clientes/cliente-espejo.service';
import { ClientesService } from '../../../../services/paginas/clientes/clientes.service';
interface MarcadorColor {
  color: string,
  nombre?: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
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
export class FullScreenComponent implements AfterViewInit {
  @Input() lngLat: [number,number] = [0,0];
  @Input() height: string;
  @Input() interactive: boolean;
  @ViewChild('mapa') divMapa!: ElementRef;
  @Input() markers:any;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
  marcadores: MarcadorColor[]=[];


  constructor(private rutasClienteEspejo: ClientesService) { }

  
 ngAfterViewInit(){
  this.mapa = new mapboxgl.Map({
    container:this.divMapa.nativeElement,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: this.lngLat,
    zoom:10,
    interactive: this.interactive
    });

    console.log(this.lngLat)
    new mapboxgl.Marker()
    .setLngLat(this.lngLat)
    .addTo(this.mapa);   
    
    this.mapa.on('load', () => {
      this.mapa.resize();
    });
    this.leerMarcador();
 }



 agregarMarcador(){

alert(this.rutasClienteEspejo.rutasClientes.length)

for(let i =0 ; i < this.rutasClienteEspejo.rutasClientes.length; i++){

  const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));


  const makerDiv: HTMLElement = document.createElement('marker-div');
  const icon: HTMLElement = document.createElement('span');
   icon.innerHTML = `<ion-icon name='location'></ion-icon>`

  makerDiv.className ='marker'
  const makerName: HTMLElement = document.createElement('span');
  makerName.innerHTML = this.rutasClienteEspejo.rutasClientes[i].NOMBRE

      icon.style.color = color;
      icon.style.fontSize = "40px";
      makerDiv.append(icon)
      makerDiv.append(makerName)
  const newMarker= new mapboxgl.Marker({
 //   element: makerDiv,
    color:color,
    draggable: true,

  
  }).setLngLat([this.rutasClienteEspejo.rutasClientes[i].LONGITUD,this.rutasClienteEspejo.rutasClientes[i].LATITUD]!)
  .addTo(this.mapa);
  
  
  this.marcadores.push({
    nombre:this.rutasClienteEspejo.rutasClientes[i].NOMBRE,
    marker:newMarker,
    color:color
  })
  
  newMarker.on('dragend', ()=>{
    console.log('dragged')
  //   this.guardarMarcadoresLocalStorage();
  })


  
}





}

irMarcador(marker: mapboxgl.Marker){
  this.mapa.flyTo(
    {center: marker.getLngLat(),   zoom: 16,}
    )
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
   //   this.guardarMarcadoresLocalStorage();
    })
  })
    }

    leerMarcador(){
//alert('done')


if(this.markers ){

  for(let i =0; i< this.markers.length;i++)
  {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMarker= new mapboxgl.Marker({
      color:color,
      draggable: true
  
    }).setLngLat([this.markers[i].LONGITUD,this.markers[i].LATITUD]!)
    .addTo(this.mapa);
    this.marcadores.push({
      nombre:this.markers[i].NOMBRE_CLIENTE,
      marker:newMarker,
      color:color
    })
  
  
  }  
//alert('markers')
}else{
  alert('no markers')
}
     
    }
}
