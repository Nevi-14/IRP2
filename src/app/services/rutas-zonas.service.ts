import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RutaZonas } from '../models/rutazonas';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { ConfiguracionesService } from './configuraciones.service';
import { Zonas } from '../models/zonas';
import { Rutas } from '../models/rutas';


@Injectable({
  providedIn: 'root'
})

export class RutasZonasService {
  rutasZonasArray: RutaZonas[]=[];
  zonas: Zonas[]=[];
  rutas: Rutas[]=[];
  zona = {
    ZONA: '', 
    NOMBRE: ''
  }
  constructor(
    private http: HttpClient,
     public alertasService: AlertasService,
     public configuracionesService: ConfiguracionesService
     
     ) { }

getAPI( api: string){
  let test: string = ''
  if ( !environment.prdMode ) test = environment.TestURL;
  let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api;
  return URL;
}

  // RUTAS APIS

  private getRutasZonas( ){
    // GET
    // https://apiirp.di-apps.co.cr/api/Rutas
    const URL = this.getAPI( environment.getRutasZonasURL);
    console.log('getRutasZonas',URL)
    return this.http.get<RutaZonas[]>( URL );
  }
  
  private putRutaZona(ruta:RutaZonas){
    // PUT
    // https://apiirp.di-apps.co.cr/api/Ruta_Zona
    let URL = this.getAPI(environment.rutaZonaURL);
        URL = URL + ruta.RUTA
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('ruta:RutaZonas',ruta);
    console.log('putRutaZona',URL)
    return this.http.put( URL, JSON.stringify(ruta),options);
  }

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
        console.log('error', error);    
      }

    );
  }
  syncRutasToPromise(){
   return this.getRutasZonas().toPromise();
    }
    

  sycPutRutaZona(i:number){
   let ruta =  this.rutasZonasArray[i]
    return this.putRutaZona(ruta).toPromise();
  }

 

  // ZONAS APIS

  
  private getZonas(){
    // GET
    // https://apiirp.di-apps.co.cr/api/Zonas
    const URL = this.getAPI( environment.zonasURL);
    return this.http.get<Zonas[]>( URL );
  }

  syncZonas(){
    this.getZonas().subscribe(
      resp =>{
        this.zonas = resp.slice(0);
        console.log('zonas', this.zonas);
      }

    );
  }



}
