import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camiones } from '../models/camiones';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class GestionCamionesService {
  camiones: Camiones[] = [];

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

  private getCamiones() {
    // GET
    //  https://apiirp.di-apps.co.cr/api/Camiones
    const URL = this.getURL(environment.camionesURL);
    console.log('getCamiones', URL)
    return this.http.get<Camiones[]>(URL);
  }

  private postCamion(camion: Camiones[]) {
    // POST
    // API https://apiirp.di-apps.co.cr/api/Camiones
    const URL = this.getURL(environment.camionesURL);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('camion:Camiones', camion);
    console.log('postCamion', URL);
    return this.http.post(URL, JSON.stringify(camion), options);
  }

  private putCamion(ID: string, camion: Camiones) {
    // PUT
    // API https://apiirp.di-apps.co.cr/api/Camiones
    let URL = this.getURL(environment.camionesURL);
    URL = URL + '?ID=' + ID;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    console.log('ID:string,camion:Camiones', ID, camion);
    console.log('putCamion', URL);
    return this.http.put(URL, JSON.stringify(camion), options);
  }


  syncCamiones() {
    this.camiones = [];
    this.alertasService.presentaLoading('Cargando datos..')
    this.getCamiones().subscribe(
      resp => {
        this.camiones = resp.slice(0);
        console.log(this.camiones)
        this.alertasService.loadingDissmiss();
      }, error => {
        this.alertasService.loadingDissmiss();
        this.alertasService.message('IRP', 'Error de conexión  con la API ' + this.configuracionesService.api);
      }

    );
  }

  syncCamionesToPromise() {
    return this.getCamiones().toPromise();
  }

  syncPostCamionesToPromise(camion: Camiones[]) {
    return this.postCamion(camion).toPromise();
  }
  syncPutCamionesToPromise(ID: string, camion: Camiones) {
    return this.putCamion(ID, camion).toPromise();
  }
}
