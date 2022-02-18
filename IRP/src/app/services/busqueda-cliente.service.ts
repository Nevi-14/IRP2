import { Injectable } from '@angular/core';
import { Clientes } from '../models/clientes';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClientesService } from './clientes.service';

@Injectable({
  providedIn: 'root'
})
export class BusquedaClienteService {

  cliente: Clientes[]=[];

  constructor(private http: HttpClient,
    public clientesService: ClientesService
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
  private getCliente(id ){
    const URL = this.getIRPURL( environment.busquedaCliente,id);
    return this.http.get<Clientes[]>( URL );
  }


  generateArrayFromComaSeparated(inputString){

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
   this.clientesService.clientes.push(cliente);
        })
     
        this.clientesService.syncClientesArray();

        console.log(this.clientesService.clientes, 'clientes')
        console.log(this.cliente, 'camclienteiones', resp)

      }

    );
  }
}
