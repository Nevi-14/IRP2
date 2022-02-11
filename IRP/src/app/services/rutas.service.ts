import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Rutas } from '../models/rutas';
import { environment } from 'src/environments/environment';


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

  constructor(private http: HttpClient,private loadingCtrl: LoadingController) { }


  
  getIRPURL( api: string,id: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL   + environment.postURL + api + id;
console.log(URL);
    return URL;
  }
  private getRutas( ){
    const URL = this.getIRPURL( environment.rutasURL,'');
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
