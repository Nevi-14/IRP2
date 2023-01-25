import { Injectable } from '@angular/core';
import { Clientes } from '../models/clientes';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClientesService } from './clientes.service';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class BusquedaClienteService {

  cliente: Clientes[]=[];

  constructor(private http: HttpClient,
    public clientesService: ClientesService,
    public planificacionRutasService:PlanificacionRutasService,
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
  private getCliente(id ){
    const URL = this.getURL( environment.busquedaCliente,id);
    return this.http.get<Clientes[]>( URL );
  }


  generateArrayFromComaSeparated(inputString){
    this.clientesService.clientesArray = [];
    this.cliente = [];
    this.clientesService.clientes = [];

      let  elementos = inputString.split(',')

    for (let i = 0 ;  i <  elementos.length; i ++){

      console.log(elementos[i], 'jdjd')


     if(elementos[i] != ''){
      this.syncClientes(elementos[i]);
     }
    }
   
  }

  syncClientes(id){
   
    this.getCliente(id).subscribe(
      resp =>{

        resp.slice(0).forEach(cliente => {
   this.cliente.push(cliente)
  const c =  this.clientesService.clientesArray.findIndex( clientesArray => clientesArray.IdCliente == cliente.IdCliente)




  if(c < 0){
    this.clientesService.clientesArray.push(cliente)
    
  }
  
        })
     

      }, error =>{
       
        let errorObject = {
          titulo: 'Obtener cliente por ID',
          fecha: new Date(),
          metodo:'GET',
          url:error.url,
          message:error.message,
          rutaError:'app/services/clientes-service.ts',
          json:JSON.stringify(this.clientesService.clientes)
        }
        this.planificacionRutasService.errorArray.push(errorObject)
        console.log(error)
       
      }

    );
  }
}
