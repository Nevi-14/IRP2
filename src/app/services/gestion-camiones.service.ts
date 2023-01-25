import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camiones } from '../models/camiones';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class GestionCamionesService {
  camiones: Camiones[]=[];
 
  

  constructor(
    private http: HttpClient,
    public alertasService: AlertasService,
    public configuracionesService: ConfiguracionesService
    
    ) { }

  getURL( api: string,identifier?: string ){

    let id = identifier ? identifier : "";
    let test: string = ''
   
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api + id;
    this.configuracionesService.api = URL;

    return URL;

  }

  private getCamiones( ){

    const URL = this.getURL( environment.camionesURL);

    return this.http.get<Camiones[]>( URL );

  }

  syncCamiones(){

   this.camiones = [];
    this.alertasService.presentaLoading('Cargando datos..')

    this.getCamiones().subscribe(

      resp =>{

this.camiones = resp.slice(0);
this.alertasService.loadingDissmiss();

      }, error  => {
        this.alertasService.loadingDissmiss();
        this.alertasService.message('IRP', 'Error de conexión  con la API ' + this.configuracionesService.api);
        
      }

    );
  }


    syncCamionesToPromise(){

      return this.getCamiones().toPromise();
     }
 async syncPromiseCamiones(){

   return  this.getCamiones().toPromise();
   }
}
