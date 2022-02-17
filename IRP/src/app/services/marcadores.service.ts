import { Injectable, ViewChild, ElementRef } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';



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


@Injectable({
  providedIn: 'root'
})


export class MarcadoresService {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  marcadores: Marcadores[]=[];
  zoomLevel: number = 10;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];

  constructor() { }




  agregarMarcadores(arreglo:any[], columna:string, id:string, nuevoCliente: boolean){

    this.marcadores = []

    for(let i =0; i < arreglo.length ;i++)
  
    {
  
  const { newMarker , color } =  this.generarMarcadorColor();
  const miniPopup = new  mapboxgl.Popup();
  const nombre = arreglo[i][columna];
  
    miniPopup.setText(nombre)
    newMarker.setPopup(miniPopup);
    newMarker.setLngLat([arreglo[i].LONGITUD,arreglo[i].LATITUD]!)
    .addTo(this.mapa);
  
  
   const marcador = {
  
    id:arreglo[i][id],
    cliente:arreglo[i],
    nombre:arreglo[i][columna],
    marker:newMarker,
    nuevoCliente: nuevoCliente,
    modificado: false,
    color:color
  
  }

    this.marcadores.push(marcador)
  
  
   }
  
  
  
  }


  agregarMarcadorNuevosRegistros(arreglo:any[], columna:string, id:string){

  for(let i =0; i < arreglo.length ;i++)
 
  {

 this.marcadores.findIndex(marcador =>{

 if( marcador.id !== arreglo[i].id){

  const { newMarker , color } =  this.generarMarcadorColor();
  const miniPopup = new  mapboxgl.Popup();
  const nombre = arreglo[i][columna];
  miniPopup.setText(nombre)
  newMarker.setPopup(miniPopup);
  newMarker.setLngLat([arreglo[i].LONGITUD,arreglo[i].LATITUD]!)
  .addTo(this.mapa);


 const marcador = {

  id:arreglo[i][id],
  cliente:arreglo[i],
  nombre:arreglo[i][columna],
  marker:newMarker,
  nuevoCliente: true,
  modificado: false,
  color:color

}
  this.marcadores.push(marcador)


 }

  });
  
  }  

  }


  //  EXPORTA LOS MARCADORES MODIFICADOS Y NUEVOS CLIENTES PARA EL POST


  exportarMarcadores(){

const marcadoresExportar = [];


    for(let i = 0; i < this.marcadores.length; i ++){     

      if(this.marcadores[i].modificado  || this.marcadores[i].nuevoCliente){

       marcadoresExportar.push(this.marcadores[i])

      }

    }

    console.log('marcadores exportar', marcadoresExportar)

  return marcadoresExportar;
  }


// ACTUALIZA UN MARCDOR PARA QUE SE MARQUE COMO MODIFICADO


  actualizarMarcador(id){

    for(let i = 0; i < this.marcadores.length; i ++){     

      if(this.marcadores[i].id === id){

        this.marcadores[i].modificado = true;

      }

    }
    
  }






// GENERA UN NUEVO MARCADOR - COLOR


  generarMarcadorColor(){

    let color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    
    const i = this.marcadores.findIndex(marcador => marcador.color == color);

    if(i >=0){
      color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    }else{

      const newMarker= new mapboxgl.Marker({
        color:color,
        draggable: false

})


      return {newMarker , color}
    }

  }


// REDIRIGE AL MARCADOR

  irMarcador(marker: mapboxgl.Marker){
    this.mapa.flyTo(
      {center: marker.getLngLat(),zoom:18}
      )
    }




  // REMUEVE UN MARCADOR DEL MAPA Y CLIENTES 


  borrarMarcador(i:number){

  this.marcadores[i].marker?.remove();

  this.marcadores.splice(i, 1);


    }
  



}
