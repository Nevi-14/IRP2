import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Clientes } from '../models/clientes';
import { HttpClient } from '@angular/common/http';
interface Marcadores {
  select:boolean,
  id: string,
  cliente: any,
  modificado: boolean,
  nuevoCliente: boolean,
  color: string,
  nombre: string,
  latitud:number,
  longitud:number,
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}
@Injectable({
  providedIn: 'root'
})
export class PlanificacionRutasService {
  errorArray = [];
  marcadores : Marcadores[]=[]
  constructor(
public http: HttpClient

  ) { }

  getIRPURL( api: string, provincia: string , canton:string , distrito: string ,id: string ){

    let test: string = ''

    if ( !environment.prdMode ) {

      test = environment.TestURL;
    }

    const URL = environment.preURL  + test + environment.postURL + api + environment.provinciaID+provincia+ environment.cantonID+canton+ environment.distritoID+distrito+ id;

console.log(URL)

    return URL;

  }

  private getClientes(provincia, canton, distrito  ){

    const URL = this.getIRPURL( environment.clientesURL, provincia,canton,distrito,'');
    return this.http.get<Clientes[]>( URL );
  }

  syncClientes(provincia, canton, distrito ){
  return   this.getClientes(provincia, canton, distrito).toPromise();
  }

  exportarMarcadores(){

    const marcadoresExportar = [];
    
        for(let i = 0; i < this.marcadores.length; i ++){     
    
          if(this.marcadores[i].modificado  || this.marcadores[i].nuevoCliente){
    
           marcadoresExportar.push(this.marcadores[i])

          }
    
        }
    
        this.marcadores = [];

      return marcadoresExportar;
      }
    


}
