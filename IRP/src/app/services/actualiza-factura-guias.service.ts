import { Injectable } from '@angular/core';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { RutaFacturasService } from './ruta-facturas.service';

@Injectable({
  providedIn: 'root'
})
export class ActualizaFacturaGuiasService {

  actualizaGuiaFacturaArray : ActualizaFacturaGuia[]=[];



 constructor( private rutasFacturasService: RutaFacturasService) {
  

 }


 asignarCamiones(idCamion){
this.rutasFacturasService.rutaFacturasArray.forEach(factura =>{
factura.CAMION = idCamion;
})

}
asignarCamionesFacturaIndividual(Factura, idCamion){
  const i =  this.rutasFacturasService.rutaFacturasArray.findIndex(f=>f.FACTURA == Factura);
console.log(i, 'jdjd');
  if(i >=0){
    this.rutasFacturasService.rutaFacturasArray[i].CAMION = idCamion

  }

  }

eliminarCamionesFacturaIndividual(Factura){
  const i =  this.rutasFacturasService.rutaFacturasArray.findIndex(f=>f.FACTURA == Factura);

  if(i >=0){
    this.rutasFacturasService.rutaFacturasArray[i].CAMION = ''

  }

  }


}
