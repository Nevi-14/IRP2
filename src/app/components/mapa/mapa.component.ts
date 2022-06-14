import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';


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
  @Input() interactive: boolean;
  @Input() location: boolean = false;


  array :any;
  constructor(public modalCtrl:ModalController, public popOverCrtl:PopoverController, public rutaZona: RutaZonaService, public zonas: ZonasService, public rutas: RutasService, public clienteEspejo: ClienteEspejoService, public clientes: ClientesService, public rutasFacturas: RutaFacturasService) { }



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