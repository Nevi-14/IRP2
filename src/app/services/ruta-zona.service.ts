import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RutaZonas } from '../models/rutazonas';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';


@Injectable({
  providedIn: 'root'
})

export class RutaZonaService {
  rutasZonasArray: RutaZonas[]=[];

  constructor(private http: HttpClient, public alertasService: AlertasService) { }


  // API URL http://api_irp_test.soportecr.xyz/api/Ruta_Zona
//http://api_irp_test.soportecr.xyz/api/Clientes/PC01
  getIRPURL( api: string,id: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL+ test  + environment.postURL + api + id;
console.log(URL);
    return URL;
  }
  private getRutasZonas( ){
    const URL = this.getIRPURL( environment.rutaZonaURL,'');
    return this.http.get<RutaZonas[]>( URL );
  }

  // SYNC RUTAS

  syncRutas(){
    this.alertasService.presentaLoading('Obteniendo información de rutas');
    this.getRutasZonas().subscribe(
      resp =>{
        this.alertasService.loadingDissmiss();
     console.log(resp)
        this.rutasZonasArray = resp;
        console.log('rutas',this.rutasZonasArray.length)
      }, error  => {
        this.alertasService.loadingDissmiss();
        let errorObject = {
          titulo: 'Lista de rutas',
          metodo:'GET',
          url:error.url,
          message:error.message,
          rutaError:'app/services/ruta-zona-service.ts',
          json:JSON.stringify(this.rutasZonasArray)
        }
        this.alertasService.elementos.push(errorObject)
        
      }

    );
  }
  syncRutasToPromise(){
 
   return this.getRutasZonas().toPromise();

    }

  // ACTUALIZAR RUTA - ZONA

  private putRutaZona(i: number){
    const URL = this.getIRPURL(environment.rutaZonaURL, this.rutasZonasArray[i].Ruta);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    return this.http.put( URL, JSON.stringify(this.rutasZonasArray[i]),options);
  }

  actualizarRutaZona(){
    
  }
}
