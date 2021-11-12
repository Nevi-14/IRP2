import { Component, Input, OnInit } from '@angular/core';
import { IonMenuToggle, ModalController } from '@ionic/angular';
import { Clientes } from '../../models/clientes';
import * as  Mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-detalle-clientes',
  templateUrl: './detalle-clientes.page.html',
  styleUrls: ['./detalle-clientes.page.scss'],
})
export class DetalleClientesPage implements OnInit {
  @Input() detalleCliente: Clientes;
  array = Array(3);
  mapa: Mapboxgl.Map;
  constructor( private modalCtrl: ModalController) { }

  ngOnInit() {
    this.createMap(this.detalleCliente.LONGITUD,this.detalleCliente.LATITUD);
    console.log(this.detalleCliente);
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  createMap(lng: number, lat: number){
    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.mapa = new Mapboxgl.Map({
    container: 'mapaCliente', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    //  MAPBOX  LNG , LAT AND GOOGLE MAPS IS LAT , LNG
    center: [lng,lat], // starting position
    zoom: 16 // starting zoom
    });

    this.mapa.on('load', () => {
      this.mapa.resize();
    });
    this.mapa.addControl(new Mapboxgl.NavigationControl());
    this.mapa.addControl(new Mapboxgl.FullscreenControl());
    this.createMarker(lng,lat);
  }
  createMarker(lng: number, lat: number){
    const marker = new Mapboxgl.Marker({
      draggable: true
      })
      .setLngLat([lng, lat])
      .addTo(this.mapa);
      marker.on('drag', () =>{
        console.log(marker.getLngLat());
     //   this.createMap(marker.getLngLat().lng,marker.getLngLat().lat);

      });
  }

}
