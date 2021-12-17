import { ElementRef, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { ClientesService } from '../../paginas/clientes/clientes.service';
import { BusquedaMapaPage } from 'src/app/pages/busqueda-mapa/busqueda-mapa.page';

interface Marcadores{
  id:string,
  cliente:any,
  modificado: boolean,
  clienteExistente:boolean,
  nuevoCliente:boolean,
  identificador:string,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}
marker: mapboxgl.Marker
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
  result: any;
  mapa!: mapboxgl.Map;
  geocoder: any;
  zoomLevel: number =12;
  array :any;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
marcadores: Marcadores[]=[];

  constructor(private modalCtrl: ModalController, private clientes: ClientesService) { }




async  crearMapa(element:ElementRef, marcadores,dragable,reload){
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
     
     this.leerMarcador(marcadores, dragable, reload);
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

  this.geocoder =   new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Buscar zona',
    })

    this.mapa.addControl(this.geocoder);

}


 this.geocoder.on('result', (e) =>{
  console.log(e.result);
  this.array = e.result
  this.busquedaMapa(e.result,element, marcadores,dragable,reload);
console.log(this.array)

  
})

//this.result = this.geocoder;

console.log(this.geocoder)


this.mapa.on('load', () => {
  this.mapa.resize();
});
  }

  async detalleCliente(){
    const modal = await this.modalCtrl.create({
      component: BusquedaMapaPage,
      cssClass: 'medium-modal',
  
    });

    
    modal.present();
  }
  async busquedaMapa(data,element, marcadores,dragable,reload) {
    const modal = await this.modalCtrl.create({
      component: BusquedaMapaPage,
      cssClass: 'medium-modal',
      componentProps:{
        data:data
      }
    });
 if(this.marcadores.length > 0){
   modal.present();


 const { data } = await modal.onDidDismiss();
 console.log(data)
   if(data !== undefined){
   
    this.crearMapa(element, marcadores,dragable,!reload)
   }
 }
 
 
  }

  reset(mapa){
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});


    this.clientes.rutasClientes = []
    this.marcadores= [];
this.crearMapa(mapa,'',false,true);
  console.log(this.marcadores,'mark')
  
  
  }






  leerMarcador(arreglo:objectoArreglo[],dragable,reload){

  

    
if(arreglo && !dragable){

  const defaultMarker = new mapboxgl.Marker()
  const miniPopupDe = new  mapboxgl.Popup();
  miniPopupDe.setText('ISLEÑA')
  defaultMarker.setPopup(miniPopupDe)

  defaultMarker.setLngLat(this.center)
  if(reload){
  
const cloneArray = [...this.marcadores]
this.marcadores = [];

for(let i =0; i < cloneArray .length;i++)
{
    
  const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
  const newMarker= new mapboxgl.Marker({
    color:color,
    draggable: false 
  })
  newMarker.setLngLat([cloneArray[i].cliente.LONGITUD,cloneArray[i].cliente.LATITUD]!)
  newMarker.on('click', () => {})

  this.marcadores.push({
    id:cloneArray[i].id,
    cliente:cloneArray[i].cliente,
    modificado: cloneArray[i].modificado,
    clienteExistente:cloneArray[i].clienteExistente,
    nuevoCliente: cloneArray[i].nuevoCliente,
    nombre:cloneArray[i].nombre,
    identificador:cloneArray[i].identificador,
    marker:newMarker,
    color:color
  })




} 

console.log(cloneArray,'clone',this.marcadores,'this.marcadores')
  }else{
    this.marcadores = [];
      
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
        modificado: false,
        clienteExistente:false,
        nuevoCliente: false,
        nombre:arreglo[i].arreglo[index][arreglo[i].nombre],
        identificador:arreglo[i].arreglo[index][arreglo[i].identificador],
        marker:newMarker,
        color:color
      })
    }

    console.log(this.marcadores,'marcadores array')

  
  } 

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
  miniPopup.on('open', () => {
    console.log('popup was opened');
    this.clientes.switchModaldetalle('planificacion-rutas',item.cliente)
    })
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


  this.marcadores[i].modificado = true;
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
