import { Injectable } from '@angular/core';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { DataTableService } from './data-table.service';
import { GestionCamionesService } from './gestion-camiones.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ActualizarFacturasService } from './actualizar-facturas.service';
import { GuiasService } from './guias.service';
import { JavascriptDatesService } from './javascript-dates.service';
import { RuteroService } from './rutero.service';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { ListaCamionesModalPage } from '../pages/lista-camiones-modal/lista-camiones-modal.page';
import { Camiones } from '../models/camiones';
import { ListaGuiasPage } from '../pages/lista-guias/lista-guias.page';
import { ListaClientesGuiasPage } from '../pages/lista-clientes-guias/lista-clientes-guias.page';

interface facturaGuia{
  cliente:string,
  idGuia: string,
  factura: PlanificacionEntregas

}

interface factura{

  id: number,
  cliente:string,
  direccion:string,
  volumenTotal: number,
  pesoTotal:number,
  bultosTotales:number,
  camion:string,
  facturas: facturaGuia[]

}


interface  GuiaEntregaArray{

      idGuia: string,
     
      chofer:string,
       fecha: Date,
       zona: string,
       ruta: string,
       consecutivo: string,
       idCamion: string,
       numClientes: number,
       capacidad: number,
       pesoRestante: number,
       peso: number,
       estado: string,
       HH: string,
       volumen: number,
       facturas: facturaGuia[]

}

@Injectable({
  providedIn: 'root'
})
export class CamionesGuiasService {
  guiaFacturasaActual = []
   Fecha : null;
  actualizaGuiaFacturaArray : ActualizaFacturaGuia[]=[];
  listaCamionesGuia: GuiaEntregaArray[] = [];
  guia:GuiaEntregaArray;
  rutaZona = null;
 constructor( 
   
  public datableService:DataTableService, 
  public camionesService:GestionCamionesService, 
  public alertCtrl: AlertController, public modalCtrl: ModalController,
  public actualizarFacturasService: ActualizarFacturasService,
  public guiasService: GuiasService,
  public javascriptDateService: JavascriptDatesService,
  public ruteroService:RuteroService
  ) {
  

 }


generarGuia(ruta,camion, fecha) {

  const date               = new Date(fecha);  // FECHA HOY
  const year               = date.getFullYear();  // AÑO
  const month              = (date.getMonth() + 1).toString().padStart(2, "0"); // MES ACTUAL FORMATO 2 DIGITOS EJEMPLO 01
  const day                = date.getDate().toString().padStart(2, "0"); // DIA ACTUAL FORMATO FECHA
  const hour            =   new Date().getHours();
  const minutes            =   new Date().getMinutes();
  const seconds            =    new Date().getSeconds();
  var ramdomNumber = Math.floor(1000 + Math.random() * 9000);
  const  consecutivo       = year+''+month+''+day+ ramdomNumber+ruta+'V';

  let guia = {

    consecutivo:consecutivo ,
    idGuia: '',
    chofer: camion.chofer,
    fecha: fecha,
    zona: '',
    ruta: '',
    idCamion: camion.idCamion,
    capacidad: camion.capacidadPeso,
    pesoRestante: 0,
    numClientes: 0,
    peso:  0,
    estado: '',
    HH:'',
    volumen:   0,
    facturas: null
 }

 if(this.listaCamionesGuia.length === 0){

  guia.consecutivo=   consecutivo + '01' 

}else if(this.listaCamionesGuia.length >= 1 && this.listaCamionesGuia.length <= 9){


  guia.consecutivo  =  consecutivo + '0' +(this.listaCamionesGuia.length + 1) 

}else{

  guia.consecutivo  = consecutivo +  this.listaCamionesGuia.length 
}

;

guia.facturas = [];

 return guia;

}









 async agregarGuia(ruta, fecha, factura){

this.rutaZona = ruta;
this.Fecha = fecha;
console.log(ruta, 'rutarutarutarutarutaruta')
  if(this.listaCamionesGuia.length > 0){


    const alert = await this.alertCtrl.create({

      cssClass: 'my-custom-class',
      header: 'ISLEÑA',
      message: '¿Defina la acción a ejecutar?',
      buttons: [
        {
          text: 'Generar nueva Guia',
          cssClass: 'secondary',
          handler: (blah) => {
         
            //this.listaCamiones( guia);
          //  this.eliminarCamionesFacturaIndividual(receipt);
          this.alertCtrl.dismiss();
      
          this.crearGuia(ruta, fecha, factura)
          this.removerFactura(factura)
          }
        },
        {
          text: 'Mover a guia existente',
          id: 'confirm-button',
          handler: () => {
         //   this.loadNewRecordExsiting(receipt)
         this.alertCtrl.dismiss();

           this.agregarFacturaGuia(factura);
          
 
          }
        },
  
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
          
          }
        }
      ]
    });
  
     await alert.present();

     return



  }
 

this.crearGuia(ruta, fecha, factura)


}

crearGuia(ruta, fecha, factura){
  let camion = this.listaCamionesGuiaModal();

  camion.then(resp =>{

  // genera modelo  guia 
  let guia = this.generarGuia(ruta, resp, fecha);


  guia.zona = ruta;
  guia.ruta = ruta;
  guia.idCamion = resp.idCamion;
  guia.estado = 'INI';
  guia.HH = 'nd';
  // asignar todas a un camion
  guia.facturas.push(factura)
  guia.peso += factura.factura.TOTAL_PESO;
  guia.volumen += Number(factura.factura.RUBRO1);;
  factura.idGuia = guia.consecutivo
  
  guia.pesoRestante = guia.capacidad - guia.peso
  guia.numClientes =guia.facturas.length;
  this.listaCamionesGuia.push(guia)

  this.actualizar(factura.factura.CLIENTE_ORIGEN, factura.factura.FACTURA, guia.consecutivo)
 
  // this.listaCamionesGuia.push(guia)

  })

}

async listaCamionesGuiaModal(){
 
  const modal = await this.modalCtrl.create({
    component: ListaCamionesModalPage,
    cssClass: 'large-modal'
  });
  modal.present();
      
        
      
  const { data } = await modal.onDidDismiss();
  let camion : Camiones;
  if(data !== undefined){

  camion = data.camion ;

      
  }


  return camion
}



removerFactura(factura){
  const index = this.listaCamionesGuia.findIndex( guia => guia.consecutivo == factura.idGuia);


  if(index >=0){

    this.guiaFacturasaActual = this.listaCamionesGuia[index].facturas;
for(let i = 0 ; i < this.listaCamionesGuia[index].facturas.length; i++){
if(this.listaCamionesGuia[index].facturas[i].factura.FACTURA == factura.factura.FACTURA){

  this.listaCamionesGuia[index].peso -= factura.factura.TOTAL_PESO;
  this.listaCamionesGuia[index].volumen -= Number(factura.factura.RUBRO1);;
  this.listaCamionesGuia[index].facturas[i].idGuia = null;
  this.actualizar(factura.factura.CLIENTE_ORIGEN, factura.factura.FACTURA, this.listaCamionesGuia[index].facturas[i].idGuia)
  this.listaCamionesGuia[index].facturas.splice(i, 1);
  this.listaCamionesGuia[index].numClientes = this.listaCamionesGuia[index].facturas.length;
  this.listaCamionesGuia[index].pesoRestante =  this.listaCamionesGuia[index].capacidad - this.listaCamionesGuia[index].peso


}

}
if(this.listaCamionesGuia[index].facturas.length == 0){
  this.listaCamionesGuia.splice(index, 1)

}  
  }

}


removerGuia(consecutivo){

for(let i = 0; i <   this.listaCamionesGuia.length; i++){

  if(this.listaCamionesGuia[i].consecutivo == consecutivo){
 
    for(let j = 0; j < this.listaCamionesGuia[i].facturas.length; j++){
      console.log(consecutivo,'consecutivo')
      this.listaCamionesGuia[i].facturas[j].idGuia = null;
      this.actualizar(this.listaCamionesGuia[i].facturas[j].factura.CLIENTE_ORIGEN, this.listaCamionesGuia[i].facturas[j].factura.FACTURA, this.listaCamionesGuia[i].facturas[j].idGuia)
    }
    this.listaCamionesGuia.splice(i,1);
  }

}
  
}

async listaGuias(){
 
  const modal = await this.modalCtrl.create({
    component: ListaGuiasPage,
    cssClass: 'large-modal'
  });
  modal.present();
      
        
      
  const { data } = await modal.onDidDismiss();
  let camion : GuiaEntregaArray;
  if(data !== undefined){

  camion = data.camion ;

      
  }


  return camion
}
  

  






agregarFacturaGuia(factura:facturaGuia){

  
 if(factura.idGuia != '' || factura.idGuia != null || factura.idGuia != undefined){

  const index = this.listaCamionesGuia.findIndex( guia => guia.consecutivo == factura.idGuia);


  if(index >=0){


    if(this.listaCamionesGuia[index].facturas.length == 0){
      this.crearGuia(this.rutaZona.Ruta, this.Fecha, factura)
      this.removerFactura(factura)
      
      this.listaCamionesGuia.splice(index, 1)
    return
    } 
    
for(let i = 0 ; i < this.listaCamionesGuia[index].facturas.length; i++){
if(this.listaCamionesGuia[index].facturas[i].factura.FACTURA == factura.factura.FACTURA){

  
  console.log(index, 'index', factura)
  this.listaCamionesGuia[index].peso -= factura.factura.TOTAL_PESO;
  this.listaCamionesGuia[index].volumen -= Number(factura.factura.RUBRO1);;
  this.listaCamionesGuia[index].facturas[i].idGuia = null;
  this.actualizar(factura.factura.CLIENTE_ORIGEN, factura.factura.FACTURA, this.listaCamionesGuia[index].facturas[i].idGuia)
  this.listaCamionesGuia[index].facturas.splice(i, 1);
  this.listaCamionesGuia[index].numClientes = this.listaCamionesGuia[index].facturas.length;
  this.listaCamionesGuia[index].pesoRestante =  this.listaCamionesGuia[index].capacidad - this.listaCamionesGuia[index].peso


}



}



 
  }


  let guia = this.listaGuias();

 guia.then(resp =>{
  for(let i = 0; i < this.listaCamionesGuia.length; i++){
    if( this.listaCamionesGuia[i].consecutivo == resp.consecutivo){
      this.listaCamionesGuia[i].peso += factura.factura.TOTAL_PESO;
      this.listaCamionesGuia[i].volumen += Number(factura.factura.RUBRO1);;
 
      this.listaCamionesGuia[i].facturas.push(factura)
      this.listaCamionesGuia[i].numClientes = this.listaCamionesGuia[i].facturas.length;
      this.listaCamionesGuia[i].pesoRestante = this.listaCamionesGuia[i].capacidad - this.listaCamionesGuia[i].peso

      this.actualizar(factura.factura.CLIENTE_ORIGEN, factura.factura.FACTURA, resp.consecutivo)
    }
 }
  })



 }



}

agregarTodasFacturasUnicoCamion(ruta, camion, fecha){

  this.listaCamionesGuia = [];
  // genera modelo  guia 
let guia = this.generarGuia(ruta, camion, fecha);
guia.zona = ruta;
guia.ruta = ruta;
guia.idCamion = camion.idCamion;
guia.estado = 'INI';
guia.HH = 'nd';
// asignar todas a un camion
console.log(guia, 'guia',ruta, camion,'ruta, camion')
this.datableService.data.forEach(
  cliente =>{

    cliente.facturas.forEach(factura =>{
      console.log(factura,'facturafactura')
      guia.peso += factura.factura.TOTAL_PESO;
      guia.volumen += Number(factura.factura.RUBRO1);;
      factura.idGuia = guia.consecutivo
     guia.facturas.push(factura)

    })
  }
)

guia.pesoRestante = guia.capacidad - guia.peso
guia.numClientes = this.datableService.data.length;
this.listaCamionesGuia.push(guia)

}

actualizar(cienteId: string , facturaId:string, consecutivo){

 
  for(let i = 0; i < this.datableService.data.length; i++){
 
   if(cienteId == this.datableService.data[i].id ){
 
     this.datableService.data[i].facturas.forEach(factura =>{
 
       if(factura.factura.FACTURA ==  facturaId){
         factura.idGuia = consecutivo ? consecutivo : null;
 
       }
     })
   }
  }
 
 }


async mostrarDetalleGuia(consecutivo, rutaZona, fecha){
 
  const i = this.listaCamionesGuia.findIndex(guia => guia.consecutivo == consecutivo)
let facturas = [];
   if(i >=0){
    facturas = this.listaCamionesGuia[i].facturas;

   }
  const modal = await this.modalCtrl.create({
    component: ListaClientesGuiasPage,
    cssClass: 'large-modal',
    componentProps:{
      facturas:facturas,
      rutaZona:rutaZona,
      fecha:fecha
    }
  });
  modal.present();
      

}


async eliminarTodosCamionesAlert(){


  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: 'PLANIFICACIÓN DE ENTREGAS',
    message: '¿Desea eliminar todos los elementos de la guia?',
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

       this.eliminarGuias();
        
        }
      }
    ]
  });

  await alert.present();


   
    
    
    }






















eliminarGuias(){

  this.listaCamionesGuia = [];

  for(let i = 0; i < this.datableService.data.length; i++){
 
    this.datableService.data[i].facturas.forEach(factura =>{

      factura.idGuia = '';

    })
  }
 

}

generarPost(){

  // this.guiasService.guiasArray = [];
 
   // this.actualizarFacturasService.actualizaFacturasArray = [];
 
   this.listaCamionesGuia.forEach(guia =>{
 
     const guiaCamion = { 
    idGuia: guia.consecutivo,
    fecha: guia.fecha,
    zona: guia.zona,
    ruta: guia.ruta,
    idCamion: guia.idCamion,
    numClientes: guia.numClientes,
    peso: guia.peso,
    estado:  guia.estado,
    HH: guia.HH,
    volumen: guia.volumen
   }
 
   this.guiasService.guiasArray.push(guiaCamion)
 
 
 
   guia.facturas.forEach(factura=>{
 
     const actualizarFactura = {
          numFactura: factura['FACTURA'],
          tipoDocumento:factura['TIPO_DOCUMENTO'],
          despachado: 'S',
          rubro3:  guia.consecutivo,
          U_LATITUD: factura['LATITUD'],
          U_LONGITUD: factura['LONGITUD']
     }
     this.actualizarFacturasService.actualizaFacturasArray.push(actualizarFactura)
   })
 
 
 
   })
 
 
   console.log('guias', this.guiasService.guiasArray , 'facturas',this.actualizarFacturasService.actualizaFacturasArray)
 
   this.actualizarFacturasService.insertarFacturas();
   this.guiasService.insertarGuias();
   this.ruteroService.insertarPostRutero();
   this.eliminarGuias();
 
  
   
 
 }



}
