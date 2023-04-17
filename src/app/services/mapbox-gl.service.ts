import { Injectable } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import { ConfiguracionesService } from './configuraciones.service';
import { Clientes } from '../models/clientes';
import { ClientesService } from './clientes.service';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { ModalController } from '@ionic/angular';
import { BusquedaMapaPage } from '../pages/busqueda-mapa/busqueda-mapa.page';
import { DetalleClientesPage } from '../pages/detalle-clientes/detalle-clientes.page';
interface marcadores {
  id: string,
  title: string,
  marker: mapboxgl.Marker,
  seleccionado: boolean,
  modificado: boolean,
  nuevo: boolean,
  excluir: boolean,
  color: string,
  type: string,
  duplicate: boolean,
  geometry: {
    type: string,
    coordinates: [
      number,
      number
    ]
  },
  properties: Clientes
}

@Injectable({
  providedIn: 'root'
})
export class MapBoxGLService {

  mapbox = (mapboxgl as typeof mapboxgl);
  zoom: number = 12;
  geocoderArray: any;
  lngLat: [number, number] = [this.configuracionesService.company.longitud, this.configuracionesService.company.latitud];
  drag: boolean = false;
  modo: string = 'off';
  clientes: Clientes[] = [];
  featuresBefore = []
  marcadores: marcadores[][] = [];
  totalMarcadores: number = 0;
  style = `mapbox://styles/mapbox/streets-v12`;
  featuresIndex = 0;
  mapa: mapboxgl.Map;
  size = 500;
  interactivo: boolean = true;
  constructor(
    public configuracionesService: ConfiguracionesService,
    public clientesService: ClientesService,
    public modalCtrl: ModalController
  ) {
    this.mapbox.accessToken = this.configuracionesService.company.mapboxKey;
  }

  moverMarcadores() {
    this.drag = !this.drag;
    if (this.drag === true) {
      this.modo = 'on';
    } else {
      this.modo = 'off';
    }
    this.renderizarMapa();
  }


  async renderizarMapa() {


    this.mapa = null;

    this.mapa = new mapboxgl.Map({
      container: document.getElementById('mapa'),
      style: this.style,
      zoom: this.zoom,
      center: this.lngLat,
      interactive: this.interactivo
    });
    await this.rellenarPines();

    new mapboxgl.Marker()
      .setLngLat(this.lngLat)
      .setPopup(new mapboxgl.Popup({ closeOnClick: false, closeButton: false }).setText(this.configuracionesService.company.company))
      .addTo(this.mapa)
      .togglePopup();

    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(new mapboxgl.FullscreenControl());
    this.mapa.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Buscar zona',
    });

    this.mapa.addControl(geocoder);

    geocoder.on('result', (e) => {
      this.geocoderArray = e.result;
      this.busquedaMapa(e.result);
    });

    if (this.marcadores.length == 0) {
      this.mapa.on('load', () => {
        this.mapa.resize();
      });
    }
    this.marcadores = await this.segregarArreglo();
    console.log(this.marcadores, 'marcadores', 'index', this.featuresIndex, 'size', this.size)
    if (this.marcadores.length > 0) {
      if (this.featuresIndex > this.marcadores.length) this.featuresIndex = 0;
      for (let i = 0; i < this.marcadores[this.featuresIndex].length; i++) {

        const { newMarker, color } = this.generarMarcadorColor(this.marcadores[this.featuresIndex][i].color);
        const indexCliente = this.clientes.findIndex(e => e.IdCliente == this.marcadores[this.featuresIndex][i].id);

        if (indexCliente >= 0) {
          if (!this.clientes[indexCliente].color) {
            this.clientes[indexCliente].color = color;
          }

        }

        this.marcadores[this.featuresIndex][i].color = color;
        this.marcadores[this.featuresIndex][i].marker = newMarker;
        newMarker.setLngLat(this.marcadores[this.featuresIndex][i].geometry.coordinates)
          .addTo(this.mapa);

        const divElement = document.createElement('div');
        const assignBtn = document.createElement('div');
        assignBtn.innerHTML = `
<ion-list> 
<ion-item>
<ion-button fill="clear" class="ion-text-wrap">
${this.marcadores[this.featuresIndex][i].title + ' ' + this.marcadores[this.featuresIndex][i].id}
</ion-button>
</ion-item>
</ion-list>
`;
        const index = this.marcadores[this.featuresIndex].findIndex(marcador => marcador.id == this.marcadores[this.featuresIndex][i].id);
        let clienteIndex = this.clientes.findIndex(e => e.IdCliente == this.marcadores[this.featuresIndex][index].id);

        divElement.appendChild(assignBtn);
        assignBtn.addEventListener('click', (e) => {

          if (index >= 0 && clienteIndex >= 0) {
            this.detalleClientes(this.clientes[clienteIndex]);
          }

        });

        newMarker.setPopup(new mapboxgl.Popup({ offset: 32 })
          .setDOMContent(divElement));
        newMarker.on('dragend', () => {
          const { lng, lat } = newMarker.getLngLat();
          if (index >= 0 && clienteIndex >= 0) {

            this.clientes[clienteIndex].LONGITUD = lng;
            this.clientes[clienteIndex].LATITUD = lat;
            if (!this.clientes[clienteIndex].modificado) {
              this.clientes[clienteIndex].modificado = true;
            }



            this.marcadores[this.featuresIndex][index].properties.LONGITUD = lng;
            this.marcadores[this.featuresIndex][index].properties.LATITUD = lat;
            this.marcadores[this.featuresIndex][index].modificado = true;
            this.marcadores[this.featuresIndex][index].marker.setLngLat([lng, lat]);
            this.marcadores[this.featuresIndex][index].geometry.coordinates = [lng, lat];

          }

        }).addTo(this.mapa);
        if (i == this.marcadores[this.featuresIndex].length - 1) {
          this.mapa.on('load', () => {
            this.mapa.resize();
          });

        }
      }
    }

  }
  async detalleClientes(cliente) {
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'ui-modal',
      componentProps: {
        detalleCliente: cliente
      }
    });
    await modal.present();
  }



  async busquedaMapa(resultadoBusqueda) {
    const modal = await this.modalCtrl.create({
      component: BusquedaMapaPage,
      cssClass: 'ui-modal',
      componentProps: {
        data: resultadoBusqueda,
      }
    });

    if (this.clientes.length > 0) {
      modal.present();
    }
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      this.renderizarMapa();
    }
  }


  async segregarArreglo() {
    this.totalMarcadores = this.featuresBefore.length
    var arrays = [];
    while (this.featuresBefore.length > 0)
      arrays.push(this.featuresBefore.splice(0, this.size));
    return arrays
  }

  async rellenarPines() {
    for (let i = 0; i < this.clientes.length; i++) {
      const feature = {
        id: this.clientes[i].IdCliente,
        title: this.clientes[i].IdCliente + ' ' + this.clientes[i].NOMBRE,
        marker: null,
        seleccionado: this.clientes[i].seleccionado ? this.clientes[i].seleccionado : false,
        modificado: this.clientes[i].modificado ? this.clientes[i].modificado : false,
        nuevo: this.clientes[i].nuevo ? this.clientes[i].nuevo : false,
        excluir: this.clientes[i].excluir ? this.clientes[i].excluir : false,
        color: this.clientes[i].color,
        type: 'Feature',
        duplicate: false,
        geometry: {
          type: 'Point',
          coordinates: [this.clientes[i].LONGITUD, this.clientes[i].LATITUD]
        },
        properties: {
          client: this.clientes[i],
        }
      }
      this.featuresBefore.push(feature)
      if (i == this.clientes.length - 1) {

        return console.log('array completed', this.marcadores)
      }
    }
  }

  generarMarcadorColor(previousColor) {
    let color = null;
    let setColor = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const i = this.marcadores[this.featuresIndex].findIndex(feature => feature.color === setColor);
    if (i >= 0) {
      this.generarMarcadorColor(previousColor);
      return
    }
    color = previousColor != null ? previousColor : setColor;
    const newMarker = new mapboxgl.Marker({
      color: color,
      draggable: this.drag
    })

    return { newMarker, color }

  }
  irMarcador(marker: mapboxgl.Marker) {

    if (marker) {
      this.mapa.flyTo(
        { center: marker.getLngLat(), zoom: 18 }
      )
      marker.togglePopup();
    }
  }
}