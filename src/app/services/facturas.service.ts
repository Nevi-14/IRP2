import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { ConfiguracionesService } from './configuraciones.service';
import { facturasGuia } from '../models/facturas';
import { AlertasService } from './alertas.service';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { FacturaLineasEspejo } from '../models/FacturaLineasEspejo';
interface facturaGuia{
  idGuia: string,
  factura: PlanificacionEntregas
}
interface factura{
  id: number,
  cliente:string,
  direccion:string,
  volumenTotal: number,
  pesoTotal:number,
  bultosTotales:number,
  camion:string,
  facturas: facturaGuia[]

}
@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  loading: HTMLIonLoadingElement;
  // control perso facturas
  totalBultosFactura: number = 0;
  pesoTotalBultosFactura: number = 0;
  //
  rutaFacturasArray: PlanificacionEntregas[]=[];
  facturas :  factura[]=[];
  constructor(
  public   http:HttpClient,
  public configuracionesService: ConfiguracionesService,
  public alertasService: AlertasService
  ) { }

  getAPI( api: string){
    let test: string = ''
    if ( !environment.prdMode ) test = environment.TestURL;
    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api;
    return URL;
  }
  private getFactura(factura:string){
    // GET
    // https://apiirp.di-apps.co.cr/api/Facturas/?id=00100102010000050020
    let URL = this.getAPI( environment.facturasUrl);
        URL = URL + factura;  
    return this.http.get<PlanificacionEntregas[]>( URL );
  }
  private getFacGuias(idGuia:string){
    // GET
    // https://apiirp.di-apps.co.cr/api/FactGuias?id=20230201AJ01V8215
    let URL = this.getAPI( environment.facturasGuiasUrl);
        URL = URL + idGuia;
    return this.http.get<facturasGuia[]>( URL );
  }

  private getRutaFacturas(ruta: string, fecha:string){
    // GET
    // https://apiirp.di-apps.co.cr/api/Facturas/?ruta=HE01&entrega=2023-02-18
    let URL = this.getAPI(environment.rutaFacturasURL);
        URL = URL + environment.rutaParam+ ruta + environment.entregaParam + fecha;
    return this.http.get<PlanificacionEntregas[]>(URL);

  }
  
  syncRutaFacturasToPromise(ruta:string, fecha:string){
    return  this.getRutaFacturas(ruta, fecha).toPromise();
   
   }

  syncGetFacturaToPromise(factura:string){
  return  this.getFactura(factura).toPromise();
  }
  syncGetFacturasGuiasToPromise(idGuia:string){
    return  this.getFacGuias(idGuia).toPromise();
  }
  syncRutaFacturas(ruta:string, fecha:string){
    this.rutaFacturasArray = [];
    this.alertasService.presentaLoading('Cargando facturas');
    this.getRutaFacturas(ruta, fecha).subscribe(
      resp =>{
        this.rutaFacturasArray = resp;
        this.totalBultosFactura = 0;
        this.pesoTotalBultosFactura = 0;
        this.facturas = [];
      
        for( let i = 0 ;  i < this.rutaFacturasArray.length; i++){
          const  facturaCliente = {
            id: this.rutaFacturasArray[i].CLIENTE_ORIGEN,
            cliente:this.rutaFacturasArray[i].NOMBRE_CLIENTE,
            direccion:this.rutaFacturasArray[i].DIRECCION_FACTURA,
            volumenTotal: this.rutaFacturasArray[i].TOTAL_VOLUMEN,
            pesoTotal:this.rutaFacturasArray[i].TOTAL_PESO_NETO,
            bultosTotales: Number(this.rutaFacturasArray[i].RUBRO1),
            camion:'',
            facturas: []     
          }    
         facturaCliente.facturas.push({idGuia:null, factura:this.rutaFacturasArray[i]});
          this.agrupar(this.rutaFacturasArray[i].CLIENTE_ORIGEN,facturaCliente);
        }
  
        this.rutaFacturasArray.forEach(factura =>{
          this.pesoTotalBultosFactura +=factura.TOTAL_PESO_NETO;
          this.totalBultosFactura += Number(factura.RUBRO1);   
        })
  
        this.alertasService.loadingDissmiss();
        this.alertasService.message('PLANIFICACIONDE ENTREGAS', 'Un total de ' + resp.length +' facturas se agregaron al sistema')
      }
    )
  
   
  }
  private postActualizarFactura (facturas:ActualizaFacturaGuia[]){
    // POST
    // API https://apiirp.di-apps.co.cr/api/ActFac
    const URL = this.getAPI( environment.actualizaFacturasURL);
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('facturas:ActualizaFacturaGuia[]', facturas);
    console.log('postActualizarFactura', URL);
    return this.http.post( URL, JSON.stringify(facturas) , options );
  }
  
  private putActualizarFactura (facturas:ActualizaFacturaGuia[]){
    // PUT
    // API https://apiirp.di-apps.co.cr/api/ActFac
    const URL = this.getAPI( environment.actualizaFacturasURL);
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('facturas:ActualizaFacturaGuia[]', facturas);
    console.log('putActualizarFactura', URL);
    return this.http.put( URL, JSON.stringify(facturas) , options );
  }
  

  insertarFacturas(facturas:ActualizaFacturaGuia[]){
    return  this.postActualizarFactura(facturas).toPromise();
  }

  actualizarFacturas(facturas:ActualizaFacturaGuia[]){
    return  this.putActualizarFactura(facturas).toPromise();
  }

  private getActualizaFacLinIdGuia(idGuia:string) {
    // GET
    // API https://apiirp.di-apps.co.cr/api/ActualizaFacLin/20221201AJ01V7718
        let URL = this.getAPI(environment.actualizaFacLinUrl);
        URL = URL + idGuia;
        console.log('getActualizaFacLinIdGuia', URL);
        return this.http.get<FacturaLineasEspejo[]>(URL);
      }
    
      syncGetActualizaFacLinToPromise(idGuia:string) {
        return this.getActualizaFacLinIdGuia(idGuia).toPromise();
      }
  agrupar(identificador, factura){
  const i = this.facturas.findIndex(factura => factura.id === identificador);
  if(i >=0){
    this.facturas[i].facturas.push(factura.facturas[0])
    return 
  }
   this.facturas.push(factura);
  
  
  
  }
}
