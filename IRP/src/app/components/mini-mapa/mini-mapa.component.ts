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
  @Input() color:string;
  @Input() imagen: string;
  constructor() { }


  ngAfterViewInit(){
    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom:14,
        interactive:this.interactive
      });
  
      mapa.on('load', () => {
        mapa.resize();
        });



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
    if(this.imagen ){
      new mapboxgl.Marker(el)
      .setLngLat(this.lngLat)
      .addTo(mapa); 
    }

 
        let defaultColor = '#2F4F4F';
     new mapboxgl.Marker(
        { 
    color:this.color ? this.color :  defaultColor,
      draggable: false
    
    }
     )
      .setLngLat(this.lngLat)
      .addTo(mapa);   

   }

}
