import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cantones } from '../models/cantones';
import { Distritos } from '../models/distritos';
import { Provincias } from '../models/provicias';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasCantonesDistritosService {
  provincias: Provincias[]=[];
  cantones: Cantones[]=[];
  distritos: Distritos[]=[];
  constructor( 
    private http: HttpClient,
    public configuracionesService: ConfiguracionesService 
    ) { }

  getAPI( api: string){
    let test: string = '';
    if ( !environment.prdMode ) test = environment.TestURL;
    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api;
   return URL;
  }

  // PROVINCIAS APIS

  private getProvincias(){
    // GET
    // https://apiirp.di-apps.co.cr/api/Provincias/
    const URL = this.getAPI( environment.provinciasURL);
    console.log('getProvincias',URL)
    return this.http.get<Provincias[]>( URL );
  }
  
  syncProvincias(){
    this.getProvincias().subscribe(
      resp =>{
        this.provincias = resp.slice(0);
      }
    );
  }

    // CANTONES APIS
  
  private getCantonesCodProvincia(codProvincia:string){
    // GET
    // https://apiirp.di-apps.co.cr/api/Cantones/4
    let URL = this.getAPI( environment.cantonesURL);
        URL = URL + codProvincia;
    return this.http.get<Cantones[]>( URL );
  }

  syncCantones(codProvincia:string){
    this.getCantonesCodProvincia(codProvincia).subscribe(
      resp =>{
        this.cantones = resp.slice(0);
      }
    );
  }

      // DISTRITOS APIS

  private getDistritos(idP:string,idC:string){
    // GET
    // https://apiirp.di-apps.co.cr/api/Distritos/?IdP=4&IdC=04
    let URL = this.getAPI( environment.distritosURL);
        URL = URL + + environment.provinciaID +idP+ environment.cantonID + idC;
        console.log('idP,idC', idP, idC);
        console.log('getDistritos', URL );
    return this.http.get<Distritos[]>( URL );
  }

  syncDistritos(idP:string,idC:string){
    this.getDistritos(idP, idC).subscribe(
      resp =>{
        this.distritos = resp.slice(0);
      }
    );
  }



}
