import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { GuiaEntrega } from '../../models/guiaEntrega';
import { PdfService } from 'src/app/services/pdf.service';
import { HttpClient } from '@angular/common/http';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { format } from 'date-fns';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { RuteroService } from 'src/app/services/rutero.service';
interface facturas {
  IdFactura:number,
  Factura:string,
  Tipo_Documento:string,
  idCliente:number,
  FechaAsignada:string,
  Entregada:number,
  Liquidada:number,
  UsuarioLiquida:string,
  FechaLiquida:string,
  LatitudEntrega:string,
  LongitudEntrega:string
  }
interface impresion {
  Guia:string,
  IdEstado:string,
  Estado:string,
  FechaCrea:Date,
  FechaPrometida:Date,
  Chofer:string,
  Camion:string,
  Monto:number,
  UsuarioAsigna:string,
  UsuarioAnula:string,
  FechaAnula:string,
  Facturas:facturas[ ]
  }
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
  estado = 'INI';
  show = true; 
  constructor(
   public modalCtrl:ModalController,
   public pdfService:PdfService,
   public http:HttpClient,
   public camionesService:GestionCamionesService,
   public planificacionEntregasService:PlanificacionEntregasService,
   public alertasService: AlertasService,
   public configuracionesService:ConfiguracionesService,
   public facturasService:FacturasService,
   public ruteroService: RuteroService,
   public alertCtrl:AlertController,
   public popOverCtrl:PopoverController
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
 async cerrarFechaModal(){
    const popover = await this.popOverCtrl.getTop();
    if (popover)
        await popover.dismiss(null);
 
  }
  async cambiarEstado(guia:GuiaEntrega){

const alert = await this.alertCtrl.create({
  header:'IRP',
  subHeader:'Cambiar estado INI',
  message:'¿Desea cambiar el estado de la guia?',
  buttons:[
    {
      text:'continuar',
      handler:()=>{
        guia.estado = 'INI'
        this.planificacionEntregasService.putGuiaToPromise(guia).then(guiaEntrega =>{
          console.log(guiaEntrega,'guiaEntrega')
          this.idGuia = guia.idGuia;
          this.consultarGuias()
    
        })
    console.log('guiaaa', guia)
      }
    },
    {
      text:'cancelar',
      handler:()=>{
console.log('cancel')
      }
    }
  ]
})
 
await alert.present();


  }

  consultarGuia(guia:GuiaEntrega){
    if(this.configuracionesService.company.printing){

    
      this.facturasService.syncGetFacturasGuiasToPromise(guia.idGuia).then(facturas =>{

        let encabezado:impresion = {
          Guia:guia.idGuia,
          IdEstado:null,
          Estado:null,
          FechaCrea:guia.fecha,
          FechaPrometida:guia.fecha,
          Chofer:null,
          Camion:guia.idCamion,
          Monto:0,
          UsuarioAsigna:null,
          UsuarioAnula:null,
          FechaAnula:null,
          Facturas:[]
        }
      
      facturas.forEach((factura, index) =>{
        let linea:facturas =  {
          IdFactura:null,
          Factura:factura.FACTURA,
          Tipo_Documento:factura.TIPO_DOCUMENTO,
          idCliente:factura.CLIENTE,
          FechaAsignada:factura.FECHA,
          Entregada:null,
          Liquidada:null,
          UsuarioLiquida:null,
          FechaLiquida:null,
          LatitudEntrega:null,
          LongitudEntrega:null
        } 
       
        encabezado.Facturas.push(linea);
      
        if(index == facturas.length -1){
          console.log('guia', guia)
          console.log('facturas', facturas)
          console.log('encabezado', encabezado)
        }
      
      
      
      })
      
      
      
          console.log('priting', this.configuracionesService.company.printing)
          this.pdfService.syncPostGetTokenToPromise().then(token =>{
        
            console.log('token', token)
          }, error =>{
            console.log('error getting token', error)
          })
      
      },error =>{
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
