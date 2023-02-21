import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GuiaEntrega } from '../../models/guiaEntrega';
import { PdfService } from 'src/app/services/pdf.service';
import { HttpClient } from '@angular/common/http';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { format } from 'date-fns';
import { ConsultaGuias } from '../../models/consultaGuias';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';

@Component({
  selector: 'app-reporte-guias',
  templateUrl: './reporte-guias.page.html',
  styleUrls: ['./reporte-guias.page.scss'],
})

export class ReporteGuiasPage implements OnInit {
  @Input() guias :GuiaEntrega[]
  guiasArrayRuta :GuiaEntrega[] = [];
  idGuia = null;
  fechaInicio= new Date(format(new Date(), 'MM-dd-yyy')).toISOString();
  fechaFin=new Date(format(new Date(), 'MM-dd-yyy')).toISOString();
  textoBuscar = '';
  estado = null;
  show = true; 
  constructor(
   public modalCtrl:ModalController,
   public pdfService:PdfService,
   public http:HttpClient,
   public camionesService:GestionCamionesService,
   public planificacionEntregasService:PlanificacionEntregasService,
   public alertasService: AlertasService,
   public configuracionesService:ConfiguracionesService
  ) { }

 
  ngOnInit() {

if(this.guias){
  this.guiasArrayRuta = this.guias;
}


   
   
  }
  limpiarDatos(){
    this.guias = []; 
    this.guiasArrayRuta = []; 
    this.fechaInicio= new Date(format(new Date(), 'MM-dd-yyy')).toISOString();
    this.fechaFin=new Date(format(new Date(), 'MM-dd-yyy')).toISOString();
    this.textoBuscar = '';
    this.estado = 'RUTA';
    this.idGuia = null;

  }
  consultarGuias(){

    if(this.idGuia){
      this.alertasService.presentaLoading('Cargando datos...')
      this.planificacionEntregasService.syncGetConsultarGuia(this.idGuia).then(guias =>{
        this.alertasService.loadingDissmiss();
        this.guiasArrayRuta = guias
   this.camionesService.syncCamionesToPromise().then(resp =>{
  
    this.camionesService.camiones = resp;
  this.show = false;
   })
    
      }, error =>{
        this.alertasService.loadingDissmiss();
      })
  
      return
    }
    let fechaInicio =   new Date(format(new Date(this.fechaInicio), 'MM-dd-yyy')).toISOString();
    let fechaFin =   new Date(format(new Date(this.fechaFin), 'MM-dd-yyy')).toISOString();
    this.alertasService.presentaLoading('Cargando datos...')
    this.planificacionEntregasService.getGuiaEstadoRangoFechaToPromise(this.estado,fechaInicio,fechaFin).then(guias =>{
      this.alertasService.loadingDissmiss();
      this.guiasArrayRuta = guias
 this.camionesService.syncCamionesToPromise().then(resp =>{

  this.camionesService.camiones = resp;
this.show = false;
 })
  
    }, error =>{
      this.alertasService.loadingDissmiss();
    })

  }
  cerrarModal(){

    this.modalCtrl.dismiss();
  }

  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }
  seleccionarEstado($event){
    this.estado = $event.detail.value;
  }
  consultarGuia(guia:GuiaEntrega){
console.log('guia', guia)
if(this.configuracionesService.company.printing){
  console.log('priting', this.configuracionesService.company.printing)
  this.pdfService.syncPostGetTokenToPromise().then(token =>{

    console.log('token', token)
  }, error =>{
    console.log('error', error)
  })
}
  }
 async  retornarFacturas(guia:GuiaEntrega){
  let img = await this.http.get('../assets/islena.png', { responseType: 'blob' }).toPromise();
    this.planificacionEntregasService.syncGetManifiesto(guia.idGuia).then(facturas =>{

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
