import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClienteEspejo } from '../models/clienteEspejo';
import { Clientes } from '../models/clientes';
import { ClientesService } from './clientes.service';
import { AlertasService } from './alertas.service';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { ConfiguracionesService } from './configuraciones.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteEspejoService {

  clienteEspejo: ClienteEspejo;
  ClienteEspejoArray: ClienteEspejo[]=[];
  rutas: Clientes[]=[];

  constructor(
    
     private http: HttpClient,
     private clientes: ClientesService, 
     private alertasService: AlertasService,
     public planificacionRutasService: PlanificacionRutasService,
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



  
  private getRutas(ruta){

    const URL = this.getURL( environment.clientesURL , ruta);
    console.log('URL',URL)
    return this.http.get<Clientes[]>( URL );

  }

  

  syncRutas(ruta){

 return   this.getRutas(ruta).toPromise();
    
    
  }
  

  private postClienteEspejo (ruta){

    const URL = this.getURL( environment.postCLienteEspejoURL );

    const options = {

      headers: {

          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }

      
    };


console.log('URL postClienteEspejo', URL, 'ruta', ruta)

    return this.http.post( URL, JSON.stringify(ruta), options );
 
  }

  insertarClienteEspejo(ruta){

  

     this.alertasService.presentaLoading('Guardando cambios')
       this.postClienteEspejo(ruta).subscribe(
      

      resp => {
        
     
           this.alertasService.loadingDissmiss()


            this.alertasService.message('IRP','Los cambios se efectuaron con exito');

      },  error =>{
        this.alertasService.loadingDissmiss();
        let errorObject = {
          titulo: 'Insertar rutero',
          fecha: new Date(),
          metodo:'POST',
          url:error.url,
          message:error.message,
          rutaError:'app/services/cliente-espejo-service.ts',
          json:JSON.stringify(ruta)
        }
        this.planificacionRutasService.errorArray.push(errorObject)
        console.log(error)
       
      }
    )

  }




}
