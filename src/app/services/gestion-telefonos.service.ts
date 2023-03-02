import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { ConfiguracionesService } from './configuraciones.service';
import { Telefonos } from '../models/telefonos';


@Injectable({
  providedIn: 'root'
})
export class GestionTelefonosService {
  telefonos: Telefonos[] = [];

  constructor(
    private http: HttpClient,
    public alertasService: AlertasService,
    public configuracionesService: ConfiguracionesService

  ) { }

  getURL(api: string) {
    let test: string = '';
    if (!environment.prdMode) test = environment.TestURL;
    let URL = this.configuracionesService.company.preURL + test + this.configuracionesService.company.postURL + api;
    this.configuracionesService.api = URL;
    return URL;
  }

  private getTelefonos() {
    // GET
    //  https://apiirp.di-apps.co.cr/api/Telefonos
    const URL = this.getURL(environment.telefonosURL);
    console.log('getTelefonos', URL)
    return this.http.get<Telefonos[]>(URL);

  }

  private postTelefono(telefono: Telefonos[]) {
    // POST
    // API https://apiirp.di-apps.co.cr/api/Telefonos
    const URL = this.getURL(environment.telefonosURL);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('telefono:Telefonos[]', telefono);
    console.log('postTelefono', URL);
    return this.http.post(URL, JSON.stringify(telefono), options);
  }

  private putTelefono(ID: string, telefono: Telefonos) {
    // PUT
    // API https://apiirp.di-apps.co.cr/api/Telefonos
    let URL = this.getURL(environment.telefonosURL);
    URL = URL + '?ID=' + ID;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('ID:string,telefono:Telefonos', ID, telefono);
    console.log('putTelefono', URL);
    return this.http.put(URL, JSON.stringify(telefono), options);
  }

  syncTelefonos() {
    this.telefonos = [];
    this.alertasService.presentaLoading('Cargando datos..')
    this.getTelefonos().subscribe(
      resp => {
        this.telefonos = resp.slice(0);
        this.alertasService.loadingDissmiss();
      }, error => {
       if(error) this.alertasService.loadingDissmiss();
      }

    );
  }
  syncGetTelefonosToPromise() {
    return this.getTelefonos().toPromise();
  }
  
  syncPostTelefonosToPromise(telefono: Telefonos[]) {
    return this.postTelefono(telefono).toPromise();
  }

  syncPutTelefonosToPromise(ID: string, telefono: Telefonos) {
    return this.putTelefono(ID, telefono).toPromise();
  }

}
