import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Rutas } from '../models/rutas';
import { environment } from 'src/environments/environment';
import { ConfiguracionesService } from './configuraciones.service';


@Injectable({
  providedIn: 'root'
})
export class RutasService {
  loading: HTMLIonLoadingElement;
  ruta= {
    RUTA: '', 
  DESCRIPCION: ''
}
  rutas: Rutas[]=[];

  constructor(
    
    private http: HttpClient,
    private loadingCtrl: LoadingController,
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
  private getRutas( ){
    const URL = this.getURL( environment.rutasURL);
    return this.http.get<Rutas[]>( URL );
  }

  syncRutas(){
   
    this.getRutas().subscribe(
      resp =>{
     
        this.rutas = resp.slice(0);
        console.log('rutas',this.rutas)
      }

    );
  }
  syncRutasToPromise(){
   
    return this.getRutas().toPromise()
  }
  async presentaLoading( mensaje: string ){
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
    });
    await this.loading.present();
  }
   loadingDissmiss(){
    this.loading.dismiss();
  }








}
