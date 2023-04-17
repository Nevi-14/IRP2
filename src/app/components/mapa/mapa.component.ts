import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styles: [
    `
  
    .mapa-container {
      height:100%;
     width:100%;
  
    }

    
    ion-list{
      position: fixed;
      top: 90px;
      right: 0px;
      z-index: 99999;
      height:85%;
      width:220px;
      overflow: hidden;
      overflow-y: auto;
      ::-webkit-scrollbar {
        display: none;
        
      }
    }
    `
  ]
})
export class MapaComponent implements AfterViewInit {
  @Input() lngLat: [number,number];
  @ViewChild('mapa') divMapa!:ElementRef;
  @Input() height: string;
  @Input() width: string;
  @Input() interactive: boolean = false;
  @Input() location: boolean = false;


  array :any;
  constructor(
    public modalCtrl:ModalController,
    public popOverCrtl:PopoverController,
    public clientes: ClientesService
    ) { }



  ngAfterViewInit(): void {




    
    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.lngLat,
      zoom:14,
        interactive:this.interactive
      });


  // Create a default Marker and add it to the map.
const newMarker = new mapboxgl.Marker({  draggable: true})
.setLngLat(this.lngLat)
.addTo(mapa);


newMarker.on('dragend', ()=>{

  const { lng, lat } = newMarker!.getLngLat();
  this.lngLat  = [lng, lat];
this.ngAfterViewInit();
})

mapa.addControl(new mapboxgl.NavigationControl());
mapa.addControl(new mapboxgl.FullscreenControl());
mapa.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));



      mapa.on('load', () => {
        mapa.resize();
      });
  
     
  }






}