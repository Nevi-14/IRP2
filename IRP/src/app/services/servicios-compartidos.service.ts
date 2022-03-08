import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarioModalPage } from '../pages/calendario-modal/calendario-modal.page';
import { ListaRutasZonasModalPage } from '../pages/lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';


@Injectable({
  providedIn: 'root'
})
export class ServiciosCompartidosService {

  constructor(
    public modalCtrl: ModalController
  ) { }

  async calendarioModal(format:string){
    
    const modal = await this.modalCtrl.create({
      component: CalendarioModalPage,
      cssClass: 'calendario-modal',
    });
    modal.present();
  
    
  
    const { data } = await modal.onDidDismiss();

    if(data !== undefined){
      console.log(data)
 return this.formatoFecha(data.fecha, format)


    }
  }


  formatoFecha(date:Date, format:string){
    const dateObj = new Date(date);
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const dateValue = ('0' + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

  let formatoFecha = null;

    switch(format){

        case '-':
          formatoFecha =  year + '-' + month + '-' + dateValue;
        break;

        case '/':
          formatoFecha =  year + '/' + month + '/' + dateValue;
        break;

        default :

        formatoFecha = dateObj;

        
    }
        return formatoFecha;

  }

  async listaRutasModal(){
    
    const modal = await this.modalCtrl.create({
      component: ListaRutasZonasModalPage,
      cssClass: 'large-modal',
    });
    modal.present();
  
    
  
    const { data } = await modal.onDidDismiss();


    if(data !== undefined){
      console.log(data.ruta, 'data retorno', data !== undefined)
      console.log(data)
    return data.ruta

    }
  }







































  
}
