import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DatatableService } from 'src/app/services/datatable.service';
import { RuteroService } from 'src/app/services/rutero.service';
import { ControlCamionesGuiasService } from '../../services/control-camiones-guias.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { GuiasRutaPage } from '../guias-ruta/guias-ruta.page';
import { GestionCamionesService } from '../../services/gestion-camiones.service copy';
import { ActualizaFacLinService } from '../../services/actualizaFacLin';
import { AlertasService } from 'src/app/services/alertas.service';
import { GuiasService } from 'src/app/services/guias.service';

@Component({
  selector: 'app-gestion-liquidaciones',
  templateUrl: './gestion-liquidaciones.page.html',
  styleUrls: ['./gestion-liquidaciones.page.scss'],
})
export class GestionLiquidacionesPage implements OnInit {
guia =null;
  constructor(
public datableService: DatatableService,
public controlCamionesGuiasService: ControlCamionesGuiasService,
public planificacionEntregasService: PlanificacionEntregasService,
public ruteroService: RuteroService,
public modalCtrl: ModalController,
public gestionCamionesService: GestionCamionesService,
public actualizaFactLinService: ActualizaFacLinService,
public alertasService: AlertasService,
public guiasService: GuiasService,
public alerCtrl: AlertController
  ) { }

  ngOnInit() {
  }

   

 limpiarDatos(){
  this.guia = null;
  this.datableService.limpiarDatos();

 }

 ionViewWillEnter(){

  this.limpiarDatos();
}
ngOnDestroy(){
  this.limpiarDatos();
}


async configuracionZonaRuta() {

  const modal = await this.modalCtrl.create({
    component: GuiasRutaPage,
    cssClass: 'large-modal',
    componentProps : {
      ruta:'BOD',
      switch:false
    }
  });
   await modal.present();



  const { data } = await modal.onDidDismiss();

    if(data !== undefined  ){
      this.guia = data.guia;
      let facturas = [];
console.log(data, 'data')
this.actualizaFactLinService.syncGetActualizaFacLin(this.guia.idGuia).then(resp =>{
  console.log(resp, 'resp')

  resp.forEach(factura =>{

    if(factura.cantEntregar -  factura.cantEntregada != 0){
      facturas.push(factura)
    }

  });

  if(facturas.length == 0){
    this.alertasService.message('GESTION LIQUIDACIONES', 'No hay datos disponibles')
  }
  this.datableService.agruparElementos(facturas, 'numFactura',  [
        
    {name:'factura',default:true}

]).then(resp =>{
console.log(resp, 'respppp')
this.datableService.generarDataTable(resp, 10).then(resp =>{
  this.datableService.page = 0;
  this.datableService.totalPages = resp.length;

  this.datableService.dataTableArray = resp;
  console.log('elementos agrupados', resp)

  this.datableService.dataTableArray.forEach(facturas =>{

    facturas.forEach(factura =>{
      console.log('factura', factura)
    factura.forEach(fac =>{
      console.log('fac', fac)
    })
    })
    
  })
})
  })

})

 
      
       
    }


  }


 async liquidarGuia(){


    const alert = await this.alerCtrl.create({
      cssClass: 'my-custom-class',
      header: 'IRP',
      message: '¿Desea finalizar la guia '+this.guia.idGuia + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            this.guia.estado = 'FIN'
            this.alertasService.presentaLoading('Actualizando Guia')
            this.guiasService.putGuias(this.guia).then(resp =>{
             console.log(resp)
        this.alertasService.loadingDissmiss();
        this.limpiarDatos();
          }), error =>{
                  this.alertasService.message('IRP', 'Error actualizando la guia')
            this.alertasService.loadingDissmiss();    
            this.limpiarDatos();
            console.log(error)
                  
                 }
          }
        }
      ]
    });

    await alert.present();




}


}
