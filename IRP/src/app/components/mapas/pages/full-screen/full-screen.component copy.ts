import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
 
    .mapa {
      height:100%;
     width:100%;
  
    }
 
    `
  ]
})
export class FullScreenComponent implements AfterViewInit {
  @Input() lngLat: [number,number] = [0,0];
  @Input() height: string;
  @Input() interactive: boolean;
  @ViewChild('mapa') divMapa!: ElementRef;
  constructor() { }

  
 ngAfterViewInit(){
  const mapa = new mapboxgl.Map({
    container:this.divMapa.nativeElement,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: this.lngLat,
    zoom:10,
    interactive: this.interactive
    });

    console.log(this.lngLat)
    new mapboxgl.Marker()
    .setLngLat(this.lngLat)
    .addTo(mapa);   
    
    mapa.on('load', () => {
      mapa.resize();
    });
 }
}
