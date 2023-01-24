import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camiones } from '../models/camiones';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class GestionCamionesService {
  camiones: Camiones[]=[];
  URL:string = null;
  

  constructor(
    private http: HttpClient,
    public alertasService: AlertasService,
    public configuracionesService: ConfiguracionesService
    
    ) { }

  getIRPURL( api: string,id: string ){

    let test: string = ''

    if ( !environment.prdMode ) {

      test = environment.TestURL;

    }

    this.URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api + id;


this.configuracionesService.api = this.URL;

    return  this.URL;

  }

  private getCamiones( ){

    const URL = this.getIRPURL( environment.camionesURL,'');

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
        this.alertasService.message('IRP', 'Error de conexión  con la API ' + this.configuracionesService.api);
        this.alertasService.loadingDissmiss();
        let errorObject = {
          titulo: 'Lista de camiones',
          metodo:'GET',
          url:error.url,
          message:error.message,
          rutaError:'app/services/gestion-camiones.ts',
          json:JSON.stringify(this.camiones)
        }
        this.alertasService.elementos.push(errorObject)
        
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
