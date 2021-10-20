import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { MenuClientesPage } from '../pages/menu-clientes/menu-clientes.page';
import { AlertController, ModalController } from '@ionic/angular';
import { ConfiguracionRutaService } from '../services/configuracionruta.service';
import { DetalleClientesPage } from '../pages/detalle-clientes/detalle-clientes.page';
import { ClientesService } from '../services/clientes.service';
import * as  Mapboxgl from 'mapbox-gl';
import { RutasPage } from '../pages/rutas/rutas.page';
import { ZonasService } from '../services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { ConfiguracionService } from '../services/configuracion.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
mapSvg = '../assets/home/map.svg';
imagen = '../assets/home/isa.png';
mapa: Mapboxgl.Map;
textoBuscar = '';
currentMarkers=[];



  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private config: ConfiguracionRutaService, private clientes: ClientesService, private zonas: ZonasService, private rutas: RutasService, private configuracion: ConfiguracionService) {}

  ngOnInit(){
    this.getCurrentLocation();


  }

  createMap(lng: number, lat: number){
    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.mapa = new Mapboxgl.Map({
    container: 'mapa', // container ID
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
    this.mapa.addControl(new Mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

    this.createMarker('01',lng,lat);
    
  }

  createMarker(cliente: string ,lng: number, lat: number){
    const marker = new Mapboxgl.Marker({
      draggable: false
      })
      .setLngLat([lng, lat])
      .addTo(this.mapa);
/**
 *       marker.on('drag', () =>{
        console.log(marker.getLngLat());
     //   this.createMap(marker.getLngLat().lng,marker.getLngLat().lat);

      });
 */
      this.currentMarkers.push({'id':cliente,'marker':marker});
      console.log('current markers',this.currentMarkers);

      console.log(this.currentMarkers)
  }
  removeMarker(cliente){

      if (cliente!==null) {
        for (let i = this.currentMarkers.length - 1; i >= 0; i--) {
         if(cliente ===  this.currentMarkers[i].id){
         console.log( this.currentMarkers[i].marker.remove());
         }
        }
    }
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

 async menuCliente(){
    const modal = await this.modalCtrl.create({
      component: MenuClientesPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  ruta(event){
    this.config.nombreRuta = event.detail.value;
  }
  onSearchChange(event){
    console.log(event)
    this.textoBuscar = event.detail.value;
  }
  async detalleClientes(cliente){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'my-custom-class',
      componentProps:{
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }

  addValue(e, cliente): void {

    const isChecked = !e.currentTarget.checked;
    console.log(isChecked)
 if(isChecked=== true){
  console.log('checcliente',cliente.IdCliente)
  this.config.totalClientesRuta += 1;
  this.createMarker(cliente.IdCliente,cliente.LONGITUD,cliente.LATITUD);
  console.log(this.createMarker(cliente.IdCliente,cliente.LONGITUD,cliente.LATITUD))
 }else{
  this.removeMarker(cliente.CLIENTE);
  this.config.totalClientesRuta -= 1;
 }


  }

  delete(cliente: string){
console.log(cliente)
    for( let index = 0; index < this.clientes.clientesRutas.length ; index++){   
    if(this.clientes.clientesRutas[index].IdCliente === cliente){
      this.clientes.clientesRutas.splice(index,1);
     
    }
        }
        
      }


    async  message(){
    
          const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            subHeader: 'Subtitle',
            message: 'This is an alert message.',
            buttons: ['OK']
          });
      
          await alert.present();
      
          const { role } = await alert.onDidDismiss();
          console.log('onDidDismiss resolved with role', role);
     
      }


      async mostrarRuta() {
        const modal = await this.modalCtrl.create({
          component: RutasPage,
          cssClass: 'my-custom-class',
        });
        return await modal.present();
      }
  
}
