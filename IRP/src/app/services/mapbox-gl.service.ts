import { ElementRef, Injectable, ViewChild } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { ClientesService } from './paginas/clientes/clientes.service';

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

interface objectoArreglo{
nuevoCliente:boolean,
nombre:string,
identificador:string,
id:string,
arreglo:any
}

@Injectable({
  providedIn: 'root'
})



export class MapboxGLService {
 divMapa!:ElementRef;

  result: any;
  mapa!: mapboxgl.Map;
  geocoder: any;
  zoomLevel: number =12;
  array :any;
  lngLat: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
marcadores: Marcadores[]=[];


  constructor(

    public clientes: ClientesService
  ) { }




createmapa(drag) {


    
  this.mapa =  new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.lngLat,
      zoom:this.zoomLevel,
        interactive:true
      });


  // Create a default Marker and add it to the map.
const newMarker = new mapboxgl.Marker({  draggable: drag})
.setLngLat(this.lngLat)
.addTo(this.mapa );




this.mapa .addControl(new mapboxgl.NavigationControl());
this.mapa .addControl(new mapboxgl.FullscreenControl());
this.mapa .addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));



this.mapa .on('load', () => {
  this.mapa .resize();
      });
  

   //   this.leerMarcador(false,false);
    console.log(this.clientes.rutasClientes, this.clientes.nuevosClientes  ,' existentes','nuevos')

    this.marcadores = [];
          
    for(let i =0; i < this.clientes.rutasClientes.length ;i++)
    {

      const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
      const newMarker= new mapboxgl.Marker({
        color:color,
        draggable: drag
      })
      newMarker.setLngLat([this.clientes.rutasClientes[i].LONGITUD,this.clientes.rutasClientes[i].LATITUD]!)


      this.marcadores.push({
        id:this.clientes.rutasClientes[i].IdCliente,
        cliente:this.clientes.rutasClientes[i],
        modificado: false,
        clienteExistente:true,
        nuevoCliente: false,
        nombre:this.clientes.rutasClientes[i].NOMBRE,
        identificador:'',
        marker:newMarker,
        color:color
      })

   
  
      console.log(this.marcadores,'marcadores array')
  
    
    } 

    for(let i =0; i < this.clientes.nuevosClientes.length ;i++)
    {

      const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
      const newMarker= new mapboxgl.Marker({
        color:color,
        draggable: false 
      })
      newMarker.setLngLat([this.clientes.nuevosClientes[i].LONGITUD,this.clientes.nuevosClientes[i].LATITUD]!)


      this.marcadores.push({
        id:this.clientes.nuevosClientes[i].IdCliente,
        cliente:this.clientes.nuevosClientes[i],
        modificado: false,
        clienteExistente:false,
        nuevoCliente: true,
        nombre:this.clientes.nuevosClientes[i].NOMBRE,
        identificador:'',
        marker:newMarker,
        color:color
      })

   
  
      console.log(this.marcadores,'marcadores array')
  
    
    } 

    this.marcadores.forEach(item=>{
      const newMarker= new mapboxgl.Marker({
        color:item.color,
        draggable: drag
    
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
        console.log([lng, lat],'longitudes')
    
      const c    =   this.clientes.rutasClientes.findIndex(c => c.IdCliente  === item.id)  ;
      const n    =   this.clientes.nuevosClientes.findIndex(n => n.IdCliente  === item.id)  ;
    
      if(c >= 0){
        this.marcadores[i].cliente.LONGITUD = lng;
        this.marcadores[i].cliente.LATITUD = lat;
        this.clientes.rutasClientes[c].LONGITUD = lng;
        this.clientes.rutasClientes[c].LATITUD = lat;
      }
  
      if(n >= 0){
        this.clientes.nuevosClientes[n].LONGITUD = lng;
        this.clientes.nuevosClientes[n].LATITUD = lat;
      }
    
    
      this.marcadores[i].modificado = true;
          this.marcadores[i].marker.setLngLat([lng, lat]);
          this.createmapa(true);
    
      })
    
      
    
    
    })


  }

   
  irMarcador(marker: mapboxgl.Marker){
    if(marker){
     this.mapa.flyTo(
       {center: marker.getLngLat(),zoom:18}
       )
      
    }
     }


     reset(){
      this.mapa.off('zoom', ()=>{});
      this.mapa.off('zoomend', ()=>{});
      this.mapa.off('move', ()=>{});
  
  
      this.clientes.rutasClientes = []
      this.marcadores= [];
  this.createmapa(false);
    console.log(this.marcadores,'mark')
    
    
    }
  
  
  
  leerMarcador(dragable,reload){

    const arreglo = [{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes,identificador:'cliente existente'},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes,identificador:'cliente nuevo'}];

  

    
    if(arreglo && !dragable){
    
      const defaultMarker = new mapboxgl.Marker()
      const miniPopupDe = new  mapboxgl.Popup();
      miniPopupDe.setText('ISLEÑA')
      defaultMarker.setPopup(miniPopupDe)
    
      defaultMarker.setLngLat(this.lngLat)
      if(reload){
      
    const cloneArray = [...this.marcadores]
    this.marcadores = [];
    
    for(let i =0; i < cloneArray.length;i++)
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
            nuevoCliente: arreglo[i].identificador == 'cliente nuevo' ? true  : false,
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
    
    

}
