import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClienteEspejo } from '../models/clienteEspejo';
import { Clientes } from '../models/clientes';
import { ClientesService } from './clientes.service';
import { AlertasService } from './alertas.service';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';


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
     public planificacionRutasService: PlanificacionRutasService) { }

  






  getIRPURL( api: string, id: string ){
    let test = '';

    if(!environment.prdMode){

      test = environment.TestURL;

    }
    const URL = environment.preURL+ test  + environment.postURL + api +id;



    return URL;

  }



  
  private getRutas(ruta){

    const URL = this.getIRPURL( environment.clientesURL , ruta);
    console.log('URL',URL)
    return this.http.get<Clientes[]>( URL );

  }

  

  syncRutas(ruta){

 return   this.getRutas(ruta).toPromise();
    
    
  }
  

  private postClienteEspejo (ruta){

    const URL = this.getIRPURL( environment.postCLienteEspejoURL,'' );

    const options = {

      headers: {

          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }

      
    };




    return this.http.post( URL, JSON.stringify(ruta), options );
 
  }

  insertarClienteEspejo(ruta){

    console.log(ruta, 'rutaaaaaa insertada')

     this.alertasService.presentaLoading('Guardando cambios')
;
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
