import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RutaFacturas } from '../models/rutaFacturas';

@Injectable({
  providedIn: 'root'
})
export class RutaFacturasService {

  rutaFacturasArray: RutaFacturas[]=[];
  constructor(private http: HttpClient) { }

  getIrpUrl(api: string, id: string){

    let test = '';
    if(!environment.prdMode){
      test = environment.TestURL;
    }

    const URL = environment.preURL + test + environment.postURL + api + id;
    return URL;

  }


  getRutaFacturas(ruta: string){
    const URL = this.getIrpUrl(environment.rutaFacturasURL,ruta);
    return this.http.get<RutaFacturas[]>(URL);
  }

syncRutaFacturas(ruta:string){
  this.getRutaFacturas(ruta).subscribe(
    resp =>{
      this.rutaFacturasArray = resp;
      console.log(this.rutaFacturasArray,'rutas facturas')
    }
  )
}

}
