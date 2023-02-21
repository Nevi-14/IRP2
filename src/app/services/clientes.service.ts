import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { ModalController } from '@ionic/angular';
import { Clientes } from 'src/app/models/clientes';
import { environment } from 'src/environments/environment';
import { DetalleClientesPage } from 'src/app/pages/detalle-clientes/detalle-clientes.page';
import { ClienteFacturaPage } from '../pages/cliente-factura/cliente-factura.page';
import { ClientesCierre } from '../models/clientesCierre';
import { ConfiguracionesService } from './configuraciones.service';
import { ConsultaGuias } from '../models/consultaGuias';
import { AlertasService } from './alertas.service';
import { ClienteEspejo } from '../models/clienteEspejo';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
clientes: Clientes[]=[];
isChecked = false;
clientesArray = [];
cliente: Clientes[]=[];
//clientes actuales
rutasClientes: Clientes[]=[];
nuevosClientes: Clientes[]=[];
consultaGuias:ConsultaGuias[]=[];
clienteEspejo: ClienteEspejo;
rutas: Clientes[]=[];

  constructor(
       private http: HttpClient,
       private modalCtrl: ModalController,
       public configuracionesService : ConfiguracionesService,
       public alertasService: AlertasService
       
       ) { }

  getAPI( api: string ){
    let test: string = ''
    if ( !environment.prdMode )  test = environment.TestURL;
    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api;
    return URL;
  }

  private getClientesCierre(fecha:string){
  // GET
  // https://apiirp.di-apps.co.cr/api/ClientesCierre/?fecha=2023-02-01
    let URL = this.getAPI( environment.clientesClierre);
        URL = URL +  fecha;
    console.log('fecha',fecha)
    console.log('getClientesCierre',URL)
    return this.http.get<ClientesCierre[]>( URL );

  }

  
syncGetClientesCierre(fecha:string){
  return this.getClientesCierre(fecha).toPromise()
}


private consultarClientes(idGuia:string){
  // GET
  // https://apiirp.di-apps.co.cr/api/ClientesGuia/20230123CT01V3683
  let URL = this.getAPI( environment.clientesGuias);
      URL = URL + idGuia;
  return this.http.get<ConsultaGuias[]>( URL );
}


syncConsultarClientes(idGuia:string){
this.alertasService.presentaLoading('Obteniendo información de rutas');
this.consultarClientes(idGuia).subscribe(
  resp =>{
    this.alertasService.loadingDissmiss();
    this.consultaGuias = resp;
    console.log(resp);
  }, error  => {
    this.alertasService.loadingDissmiss();
    console.log('error', error)
    
  }

);
}

private getClienteByIdCliente(idCliente:string){
  // GET
  // https://apiirp.di-apps.co.cr/api/Clientes2/7636
  let URL = this.getAPI( environment.busquedaCliente);
      URL = URL + idCliente;
  return this.http.get<Clientes[]>( URL );
}

getClienteID(clientesIds:string){
  this.cliente = [];
  this.clientesArray = [];
  this.clientes = [];
  let  elementos = clientesIds.split(',');
  for (let i = 0 ;  i <  elementos.length; i ++){
   if(elementos[i] != ''){
    this.getClienteByIdCliente(elementos[i]).subscribe(
    resp =>{
    resp.slice(0).forEach(cliente => {
    this.cliente.push(cliente);
    const c =  this.clientesArray.findIndex( clientesArray => clientesArray.IdCliente == cliente.IdCliente);
    if(c < 0) this.clientesArray.push(cliente);  
 }) 
     }, error =>{
        console.log(error);      
      }
    );
   }
  } 
}


private getClientes(idP:string, idC:string, idD:string) {
  //  GET
  // https://apiirp.di-apps.co.cr/api/Clientes/?IdP=4&IdC=04&IdD=04
      let URL = this.getAPI(environment.clientesURL);
          URL =  + environment.provinciaID + idP + environment.cantonID + idC + environment.distritoID + idD;
          console.log('idP,idC,idD',idP,idC,idD);
          console.log('getClientes',URL);
      return this.http.get<Clientes[]>(URL);
    }
  
    syncClientes(idP:string, idC:string, idD:string) {
      return this.getClientes(idP, idC, idD).toPromise();
    }

    private getRutaCliente(idCliente:string){
      // GET
      // https://apiirp.di-apps.co.cr/api/Clientes/AJ01
     let URL = this.getAPI( environment.clientesURL);
         URL = URL + idCliente;
      console.log('URL',URL)
      return this.http.get<Clientes[]>( URL );
  
    }
  
    private postClienteEspejo (clienteEspejo:ClienteEspejo[]){
      // POST
      // https://apiirp.di-apps.co.cr/api/ActualizaClientes/
      const URL = this.getAPI( environment.postCLienteEspejoURL );
      const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }     
      };
  console.log('clienteEspejo:ClienteEspejo[]',clienteEspejo);
  console.log('postClienteEspejo', URL);
      return this.http.post( URL, JSON.stringify(clienteEspejo), options );
    }
  
    syncGetRutaCliente(idCliente:string){
   return   this.getRutaCliente(idCliente).toPromise();  
    }
    syncPostClienteEspejoToPromise(clienteEspejo:ClienteEspejo[]){
      return  this.postClienteEspejo(clienteEspejo).toPromise();
    }
    syncPostClienteEspejo(clienteEspejo:ClienteEspejo[]){
       this.alertasService.presentaLoading('Guardando cambios')
         this.postClienteEspejo(clienteEspejo).subscribe(
        resp => {
             this.alertasService.loadingDissmiss()
              this.alertasService.message('IRP','Los cambios se efectuaron con exito');
        },  error =>{
          this.alertasService.loadingDissmiss();
          console.log(error);
         
        }
      )
  
    }

    

  async detalleClientes(cliente:Clientes){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'large-modal',
      componentProps:{
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }

  async mostrarClienteFactura(cliente:Clientes) {
       const modal = await this.modalCtrl.create({
         component: ClienteFacturaPage,
         cssClass: 'large-modal',
         componentProps: {
           cliente: cliente
         }
       });
       return await modal.present();
     }




}


