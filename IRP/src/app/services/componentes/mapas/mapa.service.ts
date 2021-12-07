import { ElementRef, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { ClientesService } from '../../paginas/clientes/clientes.service';

interface Marcadores{
  id:string,
  cliente:any,
  identificador:string,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}

interface objectoArreglo{
nombre:string,
identificador:string,
id:string,
arreglo:any
}



@Injectable({
  providedIn: 'root'
})
export class MapaService {
  mapa!: mapboxgl.Map;

  zoomLevel: number =12;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
marcadores: Marcadores[]=[];

  constructor(private modalCtrl: ModalController, private clientes: ClientesService) { }




  crearMapa(element:ElementRef, marcadores,dragable){
//alert('hello')
    console.log(marcadores,'mapa create')

    this.mapa = new mapboxgl.Map({
      container: element.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11?optimize=true',
      center: this.center,
      zoom: this.zoomLevel
      });

      const defaultMarker = new mapboxgl.Marker()
      const miniPopupDefaultMarker = new  mapboxgl.Popup();
      miniPopupDefaultMarker.setText('ISLEÑA')
      defaultMarker.setPopup(miniPopupDefaultMarker);
      defaultMarker.setLngLat(this.center)
     .addTo(this.mapa)
     .togglePopup();
     
     this.leerMarcador(marcadores, dragable);
console.log('marcadores mapa service', marcadores)
const extra_options = true;

if(extra_options){
  this.mapa.addControl(new mapboxgl.NavigationControl());
  this.mapa.addControl(new mapboxgl.FullscreenControl());
  this.mapa.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true
  }));
  this.mapa.addControl(
    new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
    })
  )
}

this.mapa.on('load', () => {
  this.mapa.resize();
});
  }


  reset(mapa){
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});


    this.clientes.rutasClientes = []
    this.marcadores= [];
this.crearMapa(mapa,'',false);
  console.log(this.marcadores,'mark')
  
  
  }






  leerMarcador(arreglo:objectoArreglo[],dragable){

  

    
if(arreglo && !dragable){
  this.marcadores = [];
  
  const defaultMarker = new mapboxgl.Marker()
  const miniPopupDe = new  mapboxgl.Popup();
  miniPopupDe.setText('ISLEÑA')
  defaultMarker.setPopup(miniPopupDe);
 
  defaultMarker.setLngLat(this.center)
  for(let i =0; i < arreglo.length ;i++)
  {
      
    for(let index = 0 ; index < arreglo[i].arreglo.length; index ++){
      const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
      const newMarker= new mapboxgl.Marker({
        color:color,
        draggable: false 
      })
      newMarker.setLngLat([arreglo[i].arreglo[index].LONGITUD,arreglo[i].arreglo[index].LATITUD]!)
      this.marcadores.push({
        id:arreglo[i].arreglo[index][arreglo[i].id],
        cliente:arreglo[i].arreglo[index],
        nombre:arreglo[i].arreglo[index][arreglo[i].nombre],
        identificador:arreglo[i].arreglo[index][arreglo[i].identificador],
        marker:newMarker,
        color:color
      })
    }

    console.log(this.marcadores,'marcadores array')

  
  } 

  
} 

this.marcadores.forEach(item=>{
  const newMarker= new mapboxgl.Marker({
    color:item.color,
    draggable: dragable

  })



  console.log(item)
  const miniPopup = new  mapboxgl.Popup();
  const nombre = item.nombre;
  const { lng, lat } = item.marker!.getLngLat();
  miniPopup.setText(  item.id + ' ' + nombre )
  newMarker.setPopup(miniPopup);
 // newMarker.setLngLat([item.cliente.LONGITUD,item.cliente.LATITUD]!)
  newMarker.setLngLat([ lng, lat]!)
  .addTo(this.mapa);

  newMarker.on('dragend', ()=>{

    const  i = this.marcadores.findIndex(m => m.id === item.id);
 
    const { lng, lat } = newMarker!.getLngLat();
    console.log([lng, lat],'l')

  const c    =   this.clientes.rutasClientes.findIndex(c => c.IdCliente  === item.id)  ;
  const n    =   this.clientes.nuevosClientes.findIndex(n => n.IdCliente  === item.id)  ;

  if(c >= 0){
    this.marcadores[i].cliente.LONGITUD = lng;
    this.marcadores[i].cliente.LATITUD = lat;
  }
  if(c >= 0){
    this.clientes.rutasClientes[c].LONGITUD = lng;
    this.clientes.rutasClientes[c].LATITUD = lat;
  }
  if(n >= 0){
    this.clientes.nuevosClientes[n].LONGITUD = lng;
    this.clientes.nuevosClientes[n].LATITUD = lat;
  }



      this.marcadores[i].marker.setLngLat([lng, lat]);

  })

  


})








  }






  borrarMarcador(i:number){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
  
      }
    
      irMarcador(marker: mapboxgl.Marker){
       if(marker){
        this.mapa.flyTo(
          {center: marker.getLngLat(),zoom:18}
          )
          this.modalCtrl.dismiss();
       }
        }
    
      zoomCambio(valor: string){
        this.mapa.zoomTo(Number(valor));
      }
      
      zoomIn(){
        this.mapa.zoomIn();
        this.zoomLevel = this.mapa.getZoom();
        console.log('zoom in')
      
      }
      zoomOut(){
        this.mapa.zoomOut();
        this.zoomLevel = this.mapa.getZoom();
        console.log('zoom out')
      }
}
