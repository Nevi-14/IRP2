import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { ClientesService } from 'src/app/services/clientes.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { RuteroService } from 'src/app/services/rutero.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ServicioClienteService } from 'src/app/services/servicio-cliente.service';
import { GuiasRutaPage } from '../guias-ruta/guias-ruta.page';
import { ServicioClienteMarcadoresPage } from '../servicio-cliente-marcadores/servicio-cliente-marcadores.page';
import { ClientesRutasPage } from '../clientes-rutas/clientes-rutas.page';
import { Rutero } from 'src/app/models/Rutero';
interface Marcadores {
  id: string,
  cliente: any,
  modificado: boolean,
  nuevoCliente: boolean,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}



@Component({
  selector: 'app-servicio-cliente',
  templateUrl: './servicio-cliente.page.html',
  styleUrls: ['./servicio-cliente.page.scss'],
})
export class ServicioClientePage  {




  rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  drag = false;
  guia  = null;  
  modo = 'off'
  @ViewChild('mapa') divMapa!:ElementRef;
  result: any;
  mapa!: mapboxgl.Map;
  geocoder: any;
  zoomLevel: number = 12;
  array: any;
  lngLat: [number, number] = [ -84.14123589305028, 9.982628288210657 ];
  marcadores: Marcadores[] = [];
  clientesArray = [];
  coordinates = [];
  features = [];

  // NEW 
  elementosAgrupados = []
  totalClientes = 0;
  page = 0;
  mostrar = false;
    constructor(
      
      public modalCtrl: ModalController, 
      public alertCtrl: AlertController, 
      public clientes: ClientesService, 
      public zonas: ZonasService, 
      public rutas: RutasService, 
      public clienteEspejo: ClienteEspejoService, 
      public popOverCrtl: PopoverController, 
      public rutaZona: RutaZonaService, 
      public guiasService:ControlCamionesGuiasService, 
      public ruteroService: RuteroService, 
      public alertasService: AlertasService,
      public servicioClienteService: ServicioClienteService,
      
      ) {


    }




//============================================================================= 
// MODAL GESTION DE ERRORES DE CADA UNO DE LOS PROCESOS INVOLUCRADOS 
//=============================================================================


gestionErrores(){

  this.alertasService.gestorErroresModal(this.servicioClienteService.errorArray);
}


  
   ionViewWillEnter(){

    this.limpiarDatos()
  }  

  extrarCoordenadas(){
    
    this.clientesArray.sort( ( a, b ) => a.orden_visita - b.orden_visita )
  
  this.elementosAgrupados = this.paginarArreglo( this.clientesArray, 24);

   this.cargarElementosAlMapa( this.elementosAgrupados[this.page])
   
  }


  cargarElementosAlMapa(array:Rutero[]){
    this.alertasService.presentaLoading('Generando mapa....')
    let primerElemento = {
      nombre: 'ISLEÑA' ,
      longitud : this.lngLat[0],
      latitud : this.lngLat[1],
      estado:  '',
      color:  "#000000",
    }

    this.coordinates = [];

    if(this.page == 0){

      this.coordinates.push(primerElemento)


    }
    if(  array != undefined   || array != null  ){

      for(let i =0; i < array.length; i++){


        let clienteCoordenada = {
          nombre: 'Orden : ' + array[i].orden_Visita  + ' / Cliente : '+ array[i].idCliente ,
          longitud :array[i].longitud,
          latitud : array[i].latitud,
          estado:   array[i].estado,
          color: '',
        }
        this.coordinates.push(clienteCoordenada)
      
        if(i === array.length -1){
          this.crearMapa();
        }
  
      }



  
    }else{

      this.crearMapa();

    }

   
  }


  paginarArreglo (arr, size) {

    return arr.reduce((acc, val, i) => {

      let idx = Math.floor(i / size)
      let page = acc[idx] || (acc[idx] = [])
      page.push(val)
      return acc
    }, [])
  }
  prev(page){

    this.page =  page <= 0 ? 0: page -1;
    this.elementosAgrupados[this.page]
    this.cargarElementosAlMapa( this.elementosAgrupados[this.page])
   
      }
    
   // NOS PERMITE PASAR A LA SIGUIENTE PAGINA
   
    next(page){
   
    this.page =  page+1 == this.elementosAgrupados.length ?  this.elementosAgrupados.length -1 : page+1;
    this.elementosAgrupados[this.page]
    this.cargarElementosAlMapa( this.elementosAgrupados[this.page])
   
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
          color:"#000000",
          draggable: false
        })

    
     if(this.page == 0){
      newMarker.setLngLat(this.lngLat)
      .setPopup(new mapboxgl.Popup({closeOnClick: false, closeButton: false}).setText("DISTRIBUIDORA ISLEÑA"))
      .addTo(this.mapa)
      .togglePopup();
     }




     if(this.elementosAgrupados.length > 0){

      
     for(let i = 0; i <  this.elementosAgrupados[this.page].length;i++){

      const estado = this.elementosAgrupados[this.page][i].estado;
      const coordenadas :[number, number] = [this.elementosAgrupados[this.page][i].longitud,this.elementosAgrupados[this.page][i].latitud];

      const { newMarker , color } =  this.generarMarcadorColor(estado)
    
      newMarker.setLngLat(coordenadas)
      .addTo(this.mapa)
    
      const miniPopup = new  mapboxgl.Popup({closeOnClick: false, closeButton: false});
      miniPopup.setText((i+1) + ' - ' +this.elementosAgrupados[this.page][i].nombre +' '+ this.elementosAgrupados[this.page][i].idCliente)
    
      newMarker.setPopup(miniPopup)


      const el = document.createElement('div');
      const elwidth = 60;
      const elheight = 60;
      el.className = 'marker';

      el.style.width = `${elwidth}px`;
      el.style.height = `${elheight}px`;
      el.style.backgroundSize = '100%';
       
      if(estado === 'E'){
        el.style.backgroundImage = `url(assets/icons/shipped.svg)`;
        new mapboxgl.Marker(el)
      .setLngLat(coordenadas)
      .addTo(this.mapa);

      }else if (estado === 'I'){
        el.style.backgroundImage = `url(assets/icons/delivery-man.svg)`;
        new mapboxgl.Marker(el)
      .setLngLat(coordenadas)
      .addTo(this.mapa);
      }

  
      const store = document.createElement('div');
      const storewidth = 40;
      const storeheight = 40;
      store.className = 'marker-icon';
      store.style.backgroundImage = `url(assets/icons/store.svg)`;
      store.style.width = `${storewidth}px`;
      store.style.height = `${storeheight}px`;
      store.style.backgroundSize = '100%';
  
      store.addEventListener('click', () => {
       if(estado === 'I'){
         this.detalleClientes(this.elementosAgrupados[this.page][i], color, 'url(assets/icons/delivery-man.svg)')
       }else if(estado === 'E'){
         this.detalleClientes(this.elementosAgrupados[this.page][i], color, 'url(assets/icons/shipped.svg)')
       }else{
        this.detalleClientes(this.elementosAgrupados[this.page][i], color, null)
       }
       });
  
  
      new mapboxgl.Marker(store)
      .setLngLat(coordenadas)
      .addTo(this.mapa);
      console.log(' this.elementosAgrupados[this.page]',  this.elementosAgrupados[this.page][i])
     }
     


        this.mapa.on('load', () => {
          this.trazarRuta()
          this.mapa.resize();
        });
      
      }else{
  
        this.alertasService.loadingDissmiss()
      }


      }
      async  trazarRuta() {

        let firstPart =  'https://api.mapbox.com/directions/v5/mapbox/driving/'
        let middle = '';
    
        for (let i = 0; i < this.coordinates.length; i++){
      
          if(this.coordinates.length -1  == i){
            middle += this.coordinates[i].longitud+','+this.coordinates[i].latitud
          }else{
            middle += this.coordinates[i].longitud+','+this.coordinates[i].latitud+';'
          }
      
        }
      
       
        let secondPart = `?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
        let final = firstPart + middle +secondPart;
      
        if(this.coordinates.length > 0){
          const query = await fetch(
            final,
            { method: 'GET' }
          );
          const json = await query.json();
          
        
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
        this.alertasService.loadingDissmiss()
      }
    async informacionMarcadores() {
      this.features.sort( ( a, b ) => a.properties.client.orden_Visita - b.properties.client.orden_Visita )
      const modal = await this.modalCtrl.create({
        component: ServicioClienteMarcadoresPage,
        cssClass: 'auto-size-modal',
        componentProps:{
          marcadores: this.features
        }
       // backdropDismiss:false
      });
      
      await modal.present();

      const {data} = await modal.onDidDismiss();
 
     if(data !=undefined){
      const item = [data.cliente.longitud ,data.cliente.latitud]
    

      for(let i =0; i < this.elementosAgrupados.length; i++){

      for(let j = 0; j < this.elementosAgrupados[i].length; j++){
    
        if(this.elementosAgrupados[i][j].idCliente == data.cliente.idCliente){
       
          this.irMarcador(item)

          if(this.page != i){
            this.page = i 
            this.cargarElementosAlMapa(this.elementosAgrupados[i])
          this.irMarcador(item)
          }else{
            this.irMarcador(item)
          }
          return;
        }
      }
      }
        
 
     }
    
    }

    
         
 
async configuracionZonaRuta() {

  const modal = await this.modalCtrl.create({
    component: GuiasRutaPage,
    cssClass: 'large-modal',
    componentProps : {
      ruta:'RUTA',
      switch:true
    }
  });
   await modal.present();



  const { data } = await modal.onDidDismiss();

    if(data !== undefined && data.guia.idGuia != ''){
      
    console.group(data.guia, 'fatahaj')

       this.guia = data.guia
this.alertasService.presentaLoading('Cargando lista de clientes')
    const ruteros =   this.ruteroService.syncRutero(data.guia.idGuia)
          ruteros.then(rutero =>{
            this.clientesArray = rutero;
            this.clientesArray.sort((a, b) => a.orden_Visita-b.orden_Visita)

             this.features = []
             
            this.cargarMarcagores();
          
            this.elementosAgrupados = this.paginarArreglo( rutero, 24);
           
            this.alertasService.loadingDissmiss();
            this.cargarElementosAlMapa( this.elementosAgrupados[this.page])
  
          }), error =>{
            this.alertasService.loadingDissmiss();
            let errorObject = {
              titulo: 'this.ruteroService.syncRutero(data.idGuia)',
              fecha: new Date(),
              metodo:'GET',
              url:error.url,
              message:error.message,
              rutaError:'app/services/rutero-service.ts',
              json:JSON.stringify(this.clientesArray)
            }
            this.servicioClienteService.errorArray.push(errorObject)
            
            console.log(error)
           
          }
      
       
    }


  }


  cargarMarcagores(){
    this.clientesArray.forEach(cliente =>{
      const coordinate = [cliente.longitud, cliente.latitud]
      
      if(cliente.longitud != 0 && cliente.latitud != 0){
      this.coordinates.push(coordinate);
      }
      const feature =    {
      title:  cliente.idCliente +' '+cliente.nombre,
      type: 'Feature',
      geometry: {
      type: 'Point',
      coordinates: [cliente.longitud, cliente.latitud]
      },
      properties: {
      title:  cliente.idCliente +' '+cliente.nombre,
      icon:   'music',
      client: cliente,
      color: null,
      }
      }
      this.features.push(feature)
      
      })

    
  }

//============================================================================= 
// MODAL GESTION DE ERRORES DE CADA UNO DE LOS PROCESOS INVOLUCRADOS 
//=============================================================================




//============================================================================= 
//CREAR MAPA
//=============================================================================


async  getRoute() {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change

  let firstPart =  'https://api.mapbox.com/directions/v5/mapbox/driving/'
   let middle = '';

   for (let i = 0; i < this.coordinates.length; i++){

if(this.coordinates.length -1  == i){
  middle += this.coordinates[i]
}else{
  middle += this.coordinates[i]+';'
}

   }



  let secondPart = `?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;

  let final = firstPart + middle +secondPart;

if(this.coordinates.length > 0){
  const query = await fetch(
    final,
    { method: 'GET' }
  );
  const json = await query.json();


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
})


}

}


async detalleClientes(cliente, color , imagen){
  const modal = await this.modalCtrl.create({
    component: ClientesRutasPage,
    cssClass: 'extra-large-modal',
    componentProps:{
      cliente: cliente,
      color:color,
      imagen: imagen
    }
  });
  return await modal.present();
}
generarMarcadorColor(estado){


  let color = null;
  let primary = '#428cff';
  let success = "#4BB543"
  let warning = "#EED202"
  let danger = "#FF0000"
  let dark = "#010203"


    switch(estado){
      case 'P':
   color = primary
      break;
   
       case 'I':
        color = warning
   
       break;
       case 'E':
         color = success
         break;
         case 'V':
           color = danger
           break;
     
         default :
         color = dark;
 }
  const i = this.marcadores.findIndex(marcador => marcador.color === color);

  const newMarker = new mapboxgl.Marker({
    color:color,
    draggable: false

})

  return {newMarker , color}

}
 irMarcador(item) {
  if (item) {
    this.mapa.flyTo(
      { center: item, zoom: 18 }
    )

  }
}

refrescarVista(){

  const ruteros =   this.ruteroService.syncRutero(this.guia.idGuia)
  ruteros.then(rutero =>{
    this.clientesArray = rutero;
    this.clientesArray.sort((a, b) => a.orden_Visita-b.orden_Visita)

     this.features = []
     
    this.cargarMarcagores();
  
    this.elementosAgrupados = this.paginarArreglo( rutero, 24);
   
    this.alertasService.loadingDissmiss();
    this.cargarElementosAlMapa( this.elementosAgrupados[this.page])

  }), error =>{
    this.alertasService.loadingDissmiss();
    let errorObject = {
      titulo: 'this.ruteroService.syncRutero(data.idGuia)',
      fecha: new Date(),
      metodo:'GET',
      url:error.url,
      message:error.message,
      rutaError:'app/services/rutero-service.ts',
      json:JSON.stringify(this.clientesArray)
    }
    this.servicioClienteService.errorArray.push(errorObject)
    
    console.log(error)
   
  }
}

limpiarDatos() {
  this.clientesArray = []
  this.clientes.rutasClientes = [];
  this.clientes.nuevosClientes = [];
  this.elementosAgrupados = [];
  this.page = 0;
  this.guia = null;
  this.rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  this.coordinates = []
  this.features = [];
  this.extrarCoordenadas();


}

}