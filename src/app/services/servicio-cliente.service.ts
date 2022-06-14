import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultaGuias } from '../models/consultaGuias';
import { HttpClient } from '@angular/common/http';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioClienteService {
  consultaGuias:ConsultaGuias[]=[];
  
  errorArray = [];


  constructor(
    public http: HttpClient,
    public alertasService: AlertasService
  ) { }

  getIRPURL( api: string,id: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL   + environment.postURL + api + id;
console.log(URL);
    return URL;
  }
  private consultarClientes( idGuia){
    const URL = this.getIRPURL( environment.clientesGuias, idGuia);
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
