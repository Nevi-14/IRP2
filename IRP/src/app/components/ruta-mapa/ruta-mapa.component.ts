import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
interface Coordenadas {

  nombre:string ,
  longitud :number,
  latitud : number,
  estado:   string,
  color: string
}
@Component({
  selector: 'app-ruta-mapa',
  templateUrl: './ruta-mapa.component.html',
  styles: [
    `
  
    .mapa-container {
      height:100%;
     width:100%;
  
    }

    
    ion-list{
      position: fixed;
      left: 50%;
      z-index: 99999;
      height:80%;
      width:80%;
      overflow: hidden;
      overflow-y: auto;
      ::-webkit-scrollbar {
        display: none;
        
      }
    }
    `
  ]
})
export class RutaMapaComponent implements AfterViewInit {
  @Input() lngLat: [number,number];
  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!: mapboxgl.Map;
  @Input() height: string;
  @Input() width: string;
  @Input() interactive: boolean;
  @Input() location: boolean = false;
  @Input() guia: any;
  coordinates: Coordenadas[] = [];
  features = [];
  zoomLevel: number = 10.5;
  array :any;
  mostrar = false;
  constructor(public modalCtrl:ModalController, public popOverCrtl:PopoverController, public rutaZona: RutaZonaService, public zonas: ZonasService, public rutas: RutasService, public clienteEspejo: ClienteEspejoService, public clientes: ClientesService, public rutasFacturas: RutaFacturasService) { }

  ionViewWillEnter(){

  if(this.guia.verificada){
    console.log(this.guia, this.guia.ordenEntregaCliente)
    this.coordinates = [];
    this.extrarCoordenadas();
  }
  }
  mostrarDatos(){
    this.mostrar = !this.mostrar 
  }
  extrarCoordenadas(){
    let primerElemento = {
      nombre: 'ISLEÑA' ,
      longitud : this.lngLat[0],
      latitud : this.lngLat[1],
      estado:  '',
      color:  "#010203",
    }
    
    this.guia.ordenEntregaCliente.sort( ( a, b ) => a.orden_visita - b.orden_visita )
    
    this.coordinates.push(primerElemento)

    for(let i =0; i < this.guia.ordenEntregaCliente.length; i++){

      let clienteCoordenada = {
        nombre: 'Orden : ' + this.guia.ordenEntregaCliente[i].orden_visita  + ' / Cliente : '+ this.guia.ordenEntregaCliente[i].cliente ,
        longitud :this.guia.ordenEntregaCliente[i].longitud,
        latitud : this.guia.ordenEntregaCliente[i].latitud,
        estado:   this.guia.ordenEntregaCliente[i].estado,
        color: this.guia.ordenEntregaCliente[i].color,
      }
      this.coordinates.push(clienteCoordenada)

      if(i === this.guia.ordenEntregaCliente.length -1){
        this.crearMapa();
      }

    }

    this.crearMapa();
  }



  ngAfterViewInit(): void {

     
  }
  irMarcador(item) {
    if (item) {
      this.mapa.flyTo(
        { center: item, zoom: 18 }
   
      )
  
    }
    this.mostrarDatos()
  }
  crearMapa(){
    if(this.mapa){
      this.mapa.remove();
    }

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/light-v10', // Specify which map style to use
      center: this.lngLat,
      zoom: this.zoomLevel,
      interactive: true,
    });

    // Create a default Marker and add it to the map.

    const newMarker = new mapboxgl.Marker({
      color:"#010203",
      draggable: false
    })

    newMarker.setLngLat(this.lngLat)
      .setPopup(new mapboxgl.Popup({closeOnClick: false, closeButton: false}).setText("DISTRIBUIDORA ISLEÑA"))
      .addTo(this.mapa)
      .togglePopup();

    for (let i =0; i < this.coordinates.length; i++) {

      if(i > 0){
        const { newMarker , color } =  this.generarMarcadorColor(this.coordinates[i].estado)
        let coordinate :any = [this.coordinates[i].longitud, this.coordinates[i].latitud]
        console.log(coordinate)
        newMarker.setLngLat(coordinate)
        .addTo(this.mapa)
      
        const miniPopup = new  mapboxgl.Popup({closeOnClick: false, closeButton: false});
        miniPopup.setText(this.coordinates[i].nombre)
      
        newMarker.setPopup(miniPopup)
      }
    }

    this.mapa.on('load', () => {
      this.trazarRuta()
      this.mapa.resize();
    });
  }


  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  generarMarcadorColor(estado){

    let color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const newMarker = new mapboxgl.Marker({
      color:color,
      draggable: false
  
    });
  
    return {newMarker , color}
  
  }
  async  trazarRuta() {

    let firstPart =  'https://api.mapbox.com/directions/v5/mapbox/driving/'
    let middle = '';
  console.log(this.coordinates, 'this.coordinates')
    for (let i = 0; i < this.coordinates.length; i++){
  
      if(this.coordinates.length -1  == i){
        middle += this.coordinates[i].longitud+','+this.coordinates[i].latitud
      }else{
        middle += this.coordinates[i].longitud+','+this.coordinates[i].latitud+';'
      }
  
    }
  
    console.log(middle,'middle')
    let secondPart = `?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
    let final = firstPart + middle +secondPart;
  
    if(this.coordinates.length > 0){
      const query = await fetch(
        final,
        { method: 'GET' }
      );
      const json = await query.json();
      console.log(json, 'json return')
    
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      let geojson :any = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      this.mapa.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
  }
}