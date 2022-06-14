import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatatableService } from 'src/app/services/datatable.service';
import { RuteroService } from 'src/app/services/rutero.service';
import { ControlCamionesGuiasService } from '../../services/control-camiones-guias.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { GuiasRutaPage } from '../guias-ruta/guias-ruta.page';
import { GestionCamionesService } from '../../services/gestion-camiones.service copy';
import { ActualizaFacLinService } from '../../services/actualizaFacLin';

@Component({
  selector: 'app-gestion-liquidaciones',
  templateUrl: './gestion-liquidaciones.page.html',
  styleUrls: ['./gestion-liquidaciones.page.scss'],
})
export class GestionLiquidacionesPage implements OnInit {
idGuia = '';
  constructor(
public datableService: DatatableService,
public controlCamionesGuiasService: ControlCamionesGuiasService,
public planificacionEntregasService: PlanificacionEntregasService,
public ruteroService: RuteroService,
public modalCtrl: ModalController,
public gestionCamionesService: GestionCamionesService,
public actualizaFactLinService: ActualizaFacLinService
  ) { }

  ngOnInit() {
  }

   

 limpiarDatos(){
  this.idGuia = '';
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

    if(data !== undefined && data.idGuia != ''){
      this.idGuia = data.idGuia;
    
console.log(data, 'data')
this.actualizaFactLinService.syncGetActualizaFacLin(data.idGuia).then(resp =>{
  console.log(resp, 'resp')

  this.datableService.generarDataTable(resp, 10).then(resp =>{
    this.datableService.page = 0;
    this.datableService.totalPages = resp.length;

    this.datableService.dataTableArray = resp;
    console.log('elementos agrupados', resp)
  })
})

 
      
       
    }


  }


}
