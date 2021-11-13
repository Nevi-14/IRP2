import { AfterViewInit, Component, Input, ViewChild, ElementRef } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [
    
    `
  
    `
  ]
})
export class MiniMapaComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  @Input() lngLat: [number,number] = [0,0];
  @Input() height: string;
  @Input() width: string;
  @Input() interactive: boolean;
  constructor() { }


  ngAfterViewInit(){
    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom:10,
        interactive:this.interactive
      });
  
      new mapboxgl.Marker()
      .setLngLat(this.lngLat)
      .addTo(mapa);   
  
   }

}
