import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RutaFacturas } from '../../../models/rutaFacturas';

@Injectable({
  providedIn: 'root'
})
export class RutaFacturasService {

  rutaFacturasArray: RutaFacturas[]=[];
  constructor(private http: HttpClient) { }

  getIrpUrl(api: string, id: string, fecha: Date){
    const formatYmd = date => date.toISOString().slice(0, 10);
    let test = '';
    if(!environment.prdMode){
      test = environment.TestURL;
    }

    const URL = environment.preURL  + environment.postURL + api+ environment.rutaParam + id + environment.entregaParam + formatYmd(fecha);
    console.log(URL);
    return URL;

  }


  getRutaFacturas(ruta: string, fecha:Date){
    const URL = this.getIrpUrl(environment.rutaFacturasURL,ruta, fecha);
    return this.http.get<RutaFacturas[]>(URL);
  }

syncRutaFacturas(ruta:string, fecha:Date){
  this.getRutaFacturas(ruta, fecha).subscribe(
    resp =>{
      this.rutaFacturasArray = resp;
      console.log(this.rutaFacturasArray,'rutas facturas')
    }
  )
}

}
