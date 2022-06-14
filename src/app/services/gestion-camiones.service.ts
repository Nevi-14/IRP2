import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camiones } from '../models/camiones';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { FacturaLineasEspejo } from '../models/FacturaLineasEspejo';
import { PlanificacionEntregas } from '../models/planificacionEntregas';

@Injectable({
  providedIn: 'root'
})
export class GestionCamionesService {
  camiones: Camiones[]=[];

  

  constructor(
    private http: HttpClient,
    public alertasService: AlertasService
    
    ) { }

  getIRPURL( api: string,id: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +  environment.postURL + api + id;
console.log(URL);
    return URL;
  }
  private getCamiones( ){
    const URL = this.getIRPURL( environment.camionesURL,'');
    return this.http.get<Camiones[]>( URL );
  }

  syncCamiones(){
   this.camiones = [];
    this.alertasService.presentaLoading('Cargando Lista de camiones')
    this.getCamiones().subscribe(
      resp =>{
        this.camiones = resp.slice(0);
console.log('camiones', this.camiones)
this.alertasService.loadingDissmiss();
        console.log(this.camiones, 'camiones')

      }, error  => {
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
  getFacturasGuia(id){
    const URL = this.getIRPURL( environment.facturasUrl,id);
    return this.http.get<PlanificacionEntregas[]>( URL );
   }

   async syncGetFacturasGuia(id){

    return  this.getFacturasGuia(id).toPromise();
    }

    syncCamionesToPromise(){

      return this.getCamiones().toPromise();
     }
 async syncPromiseCamiones(){

   return  this.getCamiones().toPromise();
   }
}
