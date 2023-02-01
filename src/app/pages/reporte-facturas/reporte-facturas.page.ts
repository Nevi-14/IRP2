import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActualizaFacLinService } from '../../services/actualizaFacLin';
import { GuiaEntrega } from '../../models/guiaEntrega';
import { PdfService } from 'src/app/services/pdf.service';
import { HttpClient } from '@angular/common/http';
import { GestionCamionesService } from '../../services/gestion-camiones.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { AlertasService } from '../../services/alertas.service';

@Component({
  selector: 'app-reporte-facturas',
  templateUrl: './reporte-facturas.page.html',
  styleUrls: ['./reporte-facturas.page.scss'],
})

export class ReporteFacturasPage implements OnInit {
  @Input() guias :GuiaEntrega[]
  guiasArrayRuta :GuiaEntrega[] = [];
  textoBuscar = '';
  constructor(
   public modalCtrl:ModalController,
   public actualizaFacLinService: ActualizaFacLinService ,
   public pdfService:PdfService,
   public http:HttpClient,
   public camionesService:GestionCamionesService,
   public planificacionEntregasService:PlanificacionEntregasService,
   public alertasService: AlertasService
  ) { }

  ngOnInit() {

    if(!this.guias){
  
      this.alertasService.presentaLoading('Cargando datos...')
    this.planificacionEntregasService.getGuiaEstadoToPromise('RUTA').then(guias =>{
      this.alertasService.loadingDissmiss();
      this.guiasArrayRuta = guias
 this.camionesService.syncCamionesToPromise().then(resp =>{

  this.camionesService.camiones = resp;

 })
  
    }, error =>{
      this.alertasService.loadingDissmiss();
    })

    return

    }

    this.guiasArrayRuta = this.guias;
   
   
  }

  cerrarModal(){

    this.modalCtrl.dismiss();
  }

  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }

 async  retornarFacturas(guia:GuiaEntrega){
  let img = await this.http.get('../assets/islena.png', { responseType: 'blob' }).toPromise();
    this.actualizaFacLinService.syncGetManifiesto(guia.idGuia).then(facturas =>{

      const reader = new FileReader();
      reader.readAsDataURL(img); 
    
     
     reader.onloadend =  () => {
      var base64data = reader.result;          

      this.pdfService.rellenarpdf('test',base64data,guia,facturas).then(pdf =>{
    
        pdf.create().print()
      })
      
    
    };

    })

    




   
  }
}
