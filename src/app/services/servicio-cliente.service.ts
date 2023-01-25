import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultaGuias } from '../models/consultaGuias';
import { HttpClient } from '@angular/common/http';
import { AlertasService } from './alertas.service';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioClienteService {
  consultaGuias:ConsultaGuias[]=[];
  
  errorArray = [];


  constructor(
    public http: HttpClient,
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
  private consultarClientes( idGuia){
    const URL = this.getURL( environment.clientesGuias, idGuia);
    return this.http.get<ConsultaGuias[]>( URL );
  }

// SYNC RUTAS

syncConsultarClientes(idGuia){
  this.alertasService.presentaLoading('Obteniendo información de rutas');
  this.consultarClientes(idGuia).subscribe(
    resp =>{
      this.alertasService.loadingDissmiss();
   console.log(resp)
      this.consultaGuias = resp;
      console.log('consultaGuias',this.consultaGuias)
    }, error  => {
      this.alertasService.loadingDissmiss();
      let errorObject = {
        titulo: 'consultaGuias',
        metodo:'GET',
        url:error.url,
        message:error.message,
        rutaError:'app/services/ruta-zona-service.ts',
        json:JSON.stringify(this.consultaGuias)
      }
      this.alertasService.elementos.push(errorObject)
      
    }

  );
}


}
