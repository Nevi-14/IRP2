import { Injectable } from '@angular/core';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { GuiaEntrega } from '../models/guiaEntrega';
import { DataTableService } from './data-table.service';
import { GestionCamionesService } from './gestion-camiones.service';
import { RutaFacturasService } from './ruta-facturas.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ListaCapacidadCamionesPage } from '../pages/lista-capacidad-camiones/lista-capacidad-camiones.page';
import { ListaGuiasPage } from '../pages/lista-guias/lista-guias.page';
import { ListaClientesGuiasPage } from '../pages/lista-clientes-guias/lista-clientes-guias.page';
import { ActualizarFacturasService } from './actualizar-facturas.service';
import { GuiasService } from './guias.service';
import { JavascriptDatesService } from './javascript-dates.service';

interface facturaGuia{
  guia: string,
  factura: RutaFacturas

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
       facturas: []

}

@Injectable({
  providedIn: 'root'
})
export class CamionesGuiasService {

  actualizaGuiaFacturaArray : ActualizaFacturaGuia[]=[];
  listaCamionesGuia: GuiaEntregaArray[] = [];
  guia:GuiaEntregaArray;
 constructor( private rutasFacturasService: RutaFacturasService, public datableService:DataTableService, public camionesService:GestionCamionesService, public alertCtrl: AlertController, public modalCtrl: ModalController,
  
  public actualizarFacturasService: ActualizarFacturasService,
  public guiasService: GuiasService,
  public javascriptDateService: JavascriptDatesService
  ) {
  

 }


 //   CREAR UN MODELO GUIA

 crearGuia(factura) {


  const date               = new Date();  // FECHA HOY
  const year               = date.getFullYear();  // AÑO
  const month              = (date.getMonth() + 1).toString().padStart(2, "0"); // MES ACTUAL FORMATO 2 DIGITOS EJEMPLO 01
  const day                = date.getDate().toString().padStart(2, "0"); // DIA ACTUAL FORMATO FECHA
  const  consecutivo       = year+''+month+''+day+factura.RUTA+'V';



  let guia = {
    consecutivo:consecutivo ,
    idGuia: '',
    chofer: '',
    fecha: new Date(),
    zona: '',
    ruta: '',
    idCamion: '',
    capacidad: 0,
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

 const i = this.camionesService.camiones.findIndex(c=> c.idCamion == factura.CAMION)
 if( i >= 0){
guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
guia.chofer = this.camionesService.camiones[i].chofer;
 }


 guia.facturas = [];

 guia.facturas.push(factura)
 
 guia.zona = factura.ZONA;
 guia.ruta = factura.RUTA;
 guia.idCamion = factura.CAMION;
 guia.peso += factura.TOTAL_PESO;
 guia.estado = 'INI';
 guia.HH = 'nd';
 guia.pesoRestante =   guia.capacidad - factura.TOTAL_PESO;
 guia.volumen += Number(factura.RUBRO1);
 
 guia.numClientes = guia.facturas.length;

	return guia;
};



// AGREGA UN NUEVO REVISTRO A LAS GUIAS, SE LE PASA UNA FACTURA COMO PARAMETRO Y DEVUELVE UNA GUIA 

loadNewRecord(receipt ){

  const guia = this.crearGuia(receipt);
  
 if(this.listaCamionesGuia.length > 0 ){
   this.loadNewRecordAlert(receipt,guia); 
 }else{
   
   this.listaCamiones(guia);
   
 }
 
 
 
 }


 editarFactura(idGuia , factura){

console.log(idGuia,factura)
 }


 eliminarFactura(idGuia , factura){

  console.log('jfjfjfjffkfkfk')


  for(let i = 0;  i <  this.listaCamionesGuia.length; i++){
   if(this.listaCamionesGuia[i].consecutivo === idGuia){
  



    for( let j = 0 ;  j < this.listaCamionesGuia[i].facturas.length; j++){
     
  if(this.listaCamionesGuia[i].facturas[j]['FACTURA'] === factura.FACTURA ){
    
    this.listaCamionesGuia[i].pesoRestante = this.listaCamionesGuia[i].capacidad -   factura.TOTAL_PESO;
    this.listaCamionesGuia[i].volumen +=  Number(factura.RUBRO1);
    this.listaCamionesGuia[i].peso +=factura.TOTAL_PESO
  
    this.listaCamionesGuia[i].numClientes = this.listaCamionesGuia[i].facturas.length;
  console.log(this.listaCamionesGuia[i].facturas[j]['FACTURA'],'factura', j)

    this.listaCamionesGuia[i].facturas.splice(j,1);
 // console.log(idGuia, factura , index, j)
 this.eliminaridGuiaArregloTabla(idGuia ,factura)
   
  }

    }
   }
  }

   }
  

   eliminaridGuiaArregloTabla(idGuia,recibo){
console.log(idGuia, recibo, ' delettt')
    this.datableService.dataArrayToShow.forEach(cliente => {
      console.log(cliente, ' cliente ')
      cliente.facturas.forEach( factura =>{
        console.log(factura, ' delete ')
       if(factura.idGuia == idGuia && recibo.FACTURA == factura.FACTURA){
        factura.idGuia = '';
        console.log(factura)
       }
      })
    })


   }







// CARGA UN REGISTRO EXISTENTE 

async loadNewRecordExsiting(factura){

//  this.eliminarCamionesFacturaIndividual(factura);

const modal = await this.modalCtrl.create({
  component: ListaGuiasPage,
  cssClass: 'my-custom-class'
});
modal.present();
const { data } = await modal.onDidDismiss();

  if(data !== undefined){

  data.camion.pesoRestante = data.camion.capacidad -   factura.TOTAL_PESO;
  data.camion.volumen +=  Number(factura.RUBRO1);
  data.camion.peso +=factura.TOTAL_PESO
  data.camion.facturas.push(factura)
  data.camion.numClientes = data.camion.facturas.length;
  }else{

    
  
  }
  this.actualizaCamionesData();
}



// ACTUALIZA LA DATA DE TODOS LOS CAMIONES
actualizaAllCamionesData(truck){

  this.listaCamionesGuia = [];
  const camion = this.camionesService.camiones.findIndex(c=> c.idCamion == truck.idCamion)
   
  
  let guia = {
    idGuia: '',
    chofer: '',
    fecha: new Date(),
    zona: '',
    ruta: '',
    idCamion: '',
    capacidad: 0,
    pesoRestante: 0,
    numClientes: 0,
    peso:  0,
    estado: '',
    consecutivo:'',
    HH:'',
    
    volumen:   0,
    facturas: null
 }

  if( camion >= 0){
    guia.capacidad = this.camionesService.camiones[camion].capacidadPeso;
    guia.chofer = this.camionesService.camiones[camion].chofer;
  }
  guia.facturas = [];
  this.datableService.data.forEach(factura =>{

    const dt = new Date();
    const year  = dt.getFullYear();
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const day   = dt.getDate().toString().padStart(2, "0");
   const  consecutivo = year+''+month+''+day+factura.RUTA+'V';
   
   
    if(this.listaCamionesGuia.length === 0){
     guia.consecutivo=   consecutivo + '01'
   }else if(this.listaCamionesGuia.length >= 1 && this.listaCamionesGuia.length <= 9){
     guia.consecutivo  =  consecutivo + '0' +(this.listaCamionesGuia.length + 1)
   }else{
     guia.consecutivo  = consecutivo +  this.listaCamionesGuia.length
   }

factura.CAMION = truck.idCamion;
guia.zona = factura.ZONA;
guia.ruta = factura.RUTA;
guia.idCamion = truck.idCamion;
guia.facturas.push(factura)

guia.peso += factura.TOTAL_PESO;
guia.estado = 'INI';
guia.HH = 'nd';
guia.pesoRestante =   guia.capacidad - factura.TOTAL_PESO;
guia.volumen += Number(factura.RUBRO1);;

})

guia.numClientes = guia.facturas.length;
this.listaCamionesGuia.push(guia)
console.log( this.camionesService.camiones, 'camiones')
console.log(this.listaCamionesGuia, 'guia')
}


// ACTUALIZA LOS DATOS DE LOS CAMIONES

actualizaCamionesData(){


  this.listaCamionesGuia.forEach(camion=>{
  
    camion.facturas.forEach(factura =>{

  this.datableService.dataArrayToShow.forEach(data=>{

 data.facturas.forEach(facturaArrayToShow=>{


  if(facturaArrayToShow.factura.FACTURA == factura['FACTURA']){
 //   console.log('this.datableService.dataArrayToShow ', facturaArrayToShow.factura.FACTURA , factura['FACTURA'])
    facturaArrayToShow.idGuia = camion.consecutivo
    console.log('assign',facturaArrayToShow,camion)
  }

 })
       
      })

      
    })
  })
}


// MUESTRA EL MENU DE CLIENTES DE CADA CAMION

async listaClientesGuia(facturas){
  const modal = await this.modalCtrl.create({
    component: ListaClientesGuiasPage,
    componentProps:{
      facturas: facturas
    },
    cssClass: 'example-modal'
  });
  modal.present();
  const { data } = await modal.onDidDismiss();
  console.log(data)
    if(data !== undefined){


    }else{
 
      console.log('false')
    
    }


}

// MUESTRA LA LISTA DE CAMIONES DISPONIBLES

async listaCamiones(guia){
  const modal = await this.modalCtrl.create({
    component: ListaCapacidadCamionesPage,
    cssClass: 'my-custom-class'
  });
  modal.present();
  const { data } = await modal.onDidDismiss();
 
    if(data !== undefined){
      const i = this.camionesService.camiones.findIndex(c=> c.idCamion == data.camion.idCamion)
      if( i >= 0){
       guia.chofer = this.camionesService.camiones[i].chofer;
       guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
     guia.pesoRestante = guia.capacidad - guia.peso;
     guia.idCamion = data.camion.idCamion
     
     this.listaCamionesGuia.push(guia)
      }


    }else{
 
 //     console.log('false')
    
    }

this.actualizaCamionesData();
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
  this.eliminarTodosCamiones();

 
  

}


async loadNewRecordAlert(receipt,guia) {
//this.eliminarCamionesFacturaIndividual(receipt);
  //console.log(receipt)
  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: 'ISLEÑA',
    message: '¿Defina la acción a ejecutar?',
    buttons: [
      {
        text: 'Generar nueva Guia',
        cssClass: 'secondary',
        handler: (blah) => {
       
          this.listaCamiones( guia);
        //  this.eliminarCamionesFacturaIndividual(receipt);
     
        }
      },
      {
        text: 'Mover a guia existente',
        id: 'confirm-button',
        handler: () => {
          this.loadNewRecordExsiting(receipt)
         
        
     
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
}






eliminarGuia(consecutivo){

const i =   this.listaCamionesGuia.findIndex(element => element.consecutivo == consecutivo);

if(i >=0){

  for(let indexA = 0; indexA < this.listaCamionesGuia[i].facturas.length; indexA++){ 

for(let indexB = 0; indexB < this.datableService.data.length; indexB ++){

  if(  this.listaCamionesGuia[i].facturas[indexA]['FACTURA'] ===   this.datableService.data[indexB]['FACTURA']){
 
    this.datableService.data[indexB]['CAMION'] = ''


    const faturasEliminar = this.listaCamionesGuia[i].facturas

    console.log(faturasEliminar, 'eliiii', consecutivo)


  }

}

  }

  this.listaCamionesGuia.splice(i, 1);

   
}

}

editarCamionesAsignados(factura){

let guia = this.crearGuia(factura);

guia.facturas.forEach(facturas =>{

  facturas.CAMION = factura.CAMION;
  guia.zona = facturas.ZONA;
  guia.ruta = facturas.RUTA;
  guia.idCamion =  factura.CAMION;
  guia.peso += facturas.TOTAL_PESO;
  guia.estado = 'RUTA';
  guia.HH = 'HH01';
  guia.pesoRestante =   guia.capacidad - facturas.TOTAL_PESO;
  guia.volumen += Number(factura.RUBRO1);
  
  })

   for (let i =0; i < this.listaCamionesGuia.length; i++){

  
    for( let j = 0; j < this.listaCamionesGuia[i].facturas.length; j++){
    if(this.listaCamionesGuia[i].consecutivo === factura.consecutivo && this.listaCamionesGuia[i].facturas[j]['FACTURA'] == factura.FACTURA ){
     
      this.listaCamionesGuia[i].peso  -= this.listaCamionesGuia[i].facturas[j]['TOTAL_PESO']
      this.listaCamionesGuia[i].pesoRestante   += this.listaCamionesGuia[i].facturas[j]['TOTAL_PESO'];
      this.listaCamionesGuia[i].facturas.splice(j, 1)
    
    }
    
    }
    }

   if(this.listaCamionesGuia){
    this.cargarDatos(  this.listaCamionesGuia)
   }
  }

asignarCamionesFacturaIndividual(factura, camion){
  const i =  this.datableService.data.findIndex(f=>f.FACTURA == factura);

  if(this.listaCamionesGuia.length >=0){
 // this.editarCamionesAsignados(factura, camion);
//this.loadNewRecords(this.datableService.data,camion)
this.loadNewRecord(factura)
}
  if(i >=0){
    this.datableService.data[i].CAMION = camion.idCamion

  }

  }

  async eliminarCamionesFacturaIndividualAlert(factura){


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
            this.alertCtrl.dismiss();
         this.eliminarCamionesFacturaIndividual(factura);
          
          }
        }
      ]
    });
  
    await alert.present();
  
  
     
      
      
      }




   eliminarCamionesFacturaIndividual(factura){
  
this.datableService.dataArrayToShow.forEach(array =>{

  array.facturas.forEach(facturaArray =>{
    

  if(factura.FACTURA == facturaArray.factura.FACTURA){
   
    facturaArray.camion = ''
 
    for( let indexA = 0; indexA <this.listaCamionesGuia.length; indexA++ ){
      console.log(' matached', factura.FACTURA, facturaArray);

      if(this.listaCamionesGuia[indexA].idCamion === factura.camion){

 for(let indexB = 0; indexB < this.listaCamionesGuia[indexA].facturas.length; indexB++){

  console.log(factura.factura.FACTURA , this.listaCamionesGuia[indexA].facturas[indexB]['FACTURA'])
   if(factura.factura.FACTURA === this.listaCamionesGuia[indexA].facturas[indexB]['FACTURA']){

    this.listaCamionesGuia[indexA].facturas.splice(indexB, 1)
    console.log(' matached',this.listaCamionesGuia[indexA], indexA, indexB,this.listaCamionesGuia);
   }

 }
       // console.log(this.listaCamionesGuia[indexA], ' matached');
      }
    }
  }
})


 


})


/**
 * for( let indexA = 0; indexA <this.listaCamionesGuia.length; indexA++ ){
  for( let indexB = 0; indexB <this.listaCamionesGuia[indexA].facturas.length; indexB++ ){

    console.log(this.listaCamionesGuia[indexA].idCamion,'camiones 2', factura)
    if(this.listaCamionesGuia[indexA].facturas[indexB]['CAMION']== factura.CAMION){
     
      this.listaCamionesGuia[indexA].peso -= this.listaCamionesGuia[indexA].facturas[indexB]['TOTAL_PESO']
      this.listaCamionesGuia[indexA].pesoRestante = this.listaCamionesGuia[indexA].capacidad - this.listaCamionesGuia[indexA].peso
      this.listaCamionesGuia[indexA].facturas.splice(indexB, 1)
      this.listaCamionesGuia[indexA].numClientes =  this.listaCamionesGuia[indexA].facturas.length;
      if( this.listaCamionesGuia[indexA].facturas.length == 0){
        this.listaCamionesGuia = [];
        this.cargarDatos(this.listaCamionesGuia)
      }
    }
  }
}
 */


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

         this.eliminarTodosCamiones();
          
          }
        }
      ]
    });
  
    await alert.present();
  
  
     
      
      
      }


   eliminarTodosCamiones(){

    this.listaCamionesGuia = [];
      
    this.datableService.data.forEach(factura =>{
      factura.CAMION = '';
  
  })
     
      
      
      }



    cargarDatos(arreglo){
      console.log('cargadn arr', arreglo)

      this.listaCamionesGuia = [];
      console.log('cargadn arr', arreglo)
  arreglo.forEach(factura =>{

    console.log(factura, 'arregloerror')
      
  let guia = {
    idGuia: '',
    fecha: new Date(),
    zona: '',
    ruta: '',
    chofer:'',
    idCamion: '',
    capacidad: 0,
    pesoRestante: 0,
    numClientes: 0,
    peso:  0,
    estado: '',
    HH:'',
    volumen:   0,
    facturas: null
 }
  guia.facturas = [];
  guia.chofer = factura.chofer;
  guia.capacidad = factura.capacidad;
guia.zona = factura.zona;
guia.ruta = factura.ruta;
guia.idCamion = factura.idCamion;
factura.facturas.forEach(factura=> {


    guia.peso += factura.TOTAL_PESO;
    guia.estado = 'RUTA';
    guia.HH = 'HH01';
    guia.pesoRestante =   guia.capacidad - factura.TOTAL_PESO;
    guia.volumen += Number(factura.RUBRO1);
    guia.facturas.push(factura)
   
  })
  guia.numClientes = factura.facturas.length;


//this.listaCamionesGuia.push(guia)
})


console.log(this.listaCamionesGuia, 'loaded')



    }

}