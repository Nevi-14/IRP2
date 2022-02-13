import { Injectable } from '@angular/core';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { GuiaEntrega } from '../models/guiaEntrega';
import { DataTableService } from './data-table.service';
import { GestionCamionesService } from './gestion-camiones.service';
import { RutaFacturasService } from './ruta-facturas.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ListaCapacidadCamionesPage } from '../pages/lista-capacidad-camiones/lista-capacidad-camiones.page';
import { GuiaDetallesPage } from '../pages/guia-detalles/guia-detalles.page';
import { ListaGuiasPage } from '../pages/lista-guias/lista-guias.page';
import { ListaClientesGuiasPage } from '../pages/lista-clientes-guias/lista-clientes-guias.page';

@Injectable({
  providedIn: 'root'
})
export class ActualizaFacturaGuiasService {

  actualizaGuiaFacturaArray : ActualizaFacturaGuia[]=[];
  listaCamionesGuia: GuiaEntrega[] = [];
  guia:GuiaEntrega;
 constructor( private rutasFacturasService: RutaFacturasService, public datableService:DataTableService, public camionesService:GestionCamionesService, public alertCtrl: AlertController, public modalCtrl: ModalController) {
  

 }


 // HAY COMO 4 this.listaCamionesGuia.push(guia)  COMENTADOS




 crearGuia(factura) {
  const dt = new Date();
  const year  = dt.getFullYear();
  const month = (dt.getMonth() + 1).toString().padStart(2, "0");
  const day   = dt.getDate().toString().padStart(2, "0");
  const newdate = year + "/" + month + "/" + day;
let consecutivo = year+''+month+''+day+factura.RUTA+'V';

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

  console.log(new Date().getDate()      ,    // Return the day as a number (1-31)
  new Date().getDay() ,          // Return the weekday as a number (0-6)
  new Date().getFullYear() ,     // Return the four digit year (yyyy)
  new Date().getHours() ,        // Return the hour (0-23)
  new Date().getMilliseconds(),  // Return the milliseconds (0-999)
  new Date().getMinutes()    ,   // Return the minutes (0-59)
  new Date().getMonth()    ,     // Return the month (0-11)
  new Date().getSeconds()  ,     // Return the seconds (0-59)
  new Date().getTime()  ,  )

 if(this.listaCamionesGuia.length == 0){
  guia.consecutivo=   consecutivo + '01'
}else if(this.listaCamionesGuia.length >= 1 && this.listaCamionesGuia.length <= 9){
  guia.consecutivo  =  consecutivo + '0' +(this.listaCamionesGuia.length + 1)
}else{
  guia.consecutivo  = consecutivo +  this.listaCamionesGuia.length
}

 const i = this.camionesService.camiones.findIndex(c=> c.idCamion == factura.idCamion)
 if( i >= 0){
guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
guia.chofer = this.camionesService.camiones[i].chofer;
 }


 guia.facturas = [];
 guia.facturas.push(factura)
 guia.zona = factura.ZONA;
 guia.ruta = factura.RUTA;
 guia.idCamion = factura.idCamion;
 guia.peso += factura.TOTAL_PESO;
 guia.estado = 'RUTA';
 guia.HH = 'HH01';
 guia.pesoRestante =   guia.capacidad - factura.TOTAL_PESO;
 guia.volumen += factura.TOTAL_VOLUMEN;
 
 guia.numClientes = guia.facturas.length;

 console.log(guia)
	return guia;
};




// CARGAR GUIAS 



loadData(array, truck, reload){


 if(reload){

 this.listaCamionesGuia = []

  }else{




  }



}



loadNewRecord(receipt ){

  const guia = this.crearGuia(receipt);

if(this.listaCamionesGuia.length > 0 ){
  this.loadNewRecordAlert(receipt,guia); 


}else{
  
  this.listaCamiones(guia);
  console.log( this.datableService.data,'giifi')
}


this.eliminarCamionesFacturaIndividual(receipt);

}

loadNewRecords(array , truck){


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
    HH:'',
    volumen:   0,
    facturas: null
 }
 const i = this.camionesService.camiones.findIndex(c=> c.idCamion == truck.idCamion)
 if( i >= 0){
guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
guia.chofer = this.camionesService.camiones[i].chofer;
 }
guia.facturas = [];

array.forEach(factura =>{
  console.log(guia.capacidad , factura.TOTAL_PESO, guia.capacidad - factura.TOTAL_PESO)
guia.facturas.push(array)
guia.zona = factura.ZONA;
guia.ruta = factura.RUTA;
guia.idCamion = truck.idCamion;
guia.peso += factura.TOTAL_PESO;
guia.estado = 'RUTA';
guia.HH = 'HH01';
guia.pesoRestante =   guia.capacidad - factura.TOTAL_PESO;
guia.volumen += factura.TOTAL_VOLUMEN;

 })
  guia.numClientes = guia.facturas.length;
 // this.listaCamionesGuia.push(guia)
}


async loadNewRecordExsiting(factura, camion){

console.log(factura, camion)
const modal = await this.modalCtrl.create({
  component: ListaGuiasPage,
  cssClass: 'my-custom-class'
});
modal.present();
const { data } = await modal.onDidDismiss();
console.log(data)
  if(data !== undefined){
  console.log(data.camion)
  data.camion.pesoRestante = data.camion.capacidad -   factura.TOTAL_PESO;
  data.camion.volumen += factura.TOTAL_VOLUMEN;
  data.camion.peso +=factura.TOTAL_PESO
  data.camion.facturas.push(factura)
  data.camion.numClientes = data.camion.facturas.length;
  }else{

    console.log('false')
  
  }
  this.actualizaCamionesData();
}


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

factura.CAMION = truck.idCamion;
guia.zona = factura.ZONA;
guia.ruta = factura.RUTA;
guia.idCamion = truck.idCamion;
guia.facturas.push(factura)

guia.peso += factura.TOTAL_PESO;
guia.estado = 'RUTA';
guia.HH = 'HH01';
guia.pesoRestante =   guia.capacidad - factura.TOTAL_PESO;
guia.volumen += factura.TOTAL_VOLUMEN;

})

guia.numClientes = guia.facturas.length;
this.listaCamionesGuia.push(guia)
console.log( this.camionesService.camiones, 'camiones')
console.log(this.listaCamionesGuia, 'guia')
}
actualizaCamionesData(){

  this.listaCamionesGuia.forEach(camion=>{

    camion.facturas.forEach(factura =>{
console.log('factura camiones', factura)
      this.datableService.dataArrayToShow.forEach(data=>{

        if(factura['FACTURA'] == data.FACTURA){
          console.log('factura camiones w2', factura , factura['FACTURA'], data.FACTURA , factura['CAMION'],'cons', camion.consecutivo, 'data', data.consecutivo )
          data.CAMION = camion.idCamion
          //factura['CONSECUTIVO'] = camion.consecutivo
         // this.datableService.loadData();
        }
      })

      
    })
  })
}

async listaClientesGuia(facturas){
  const modal = await this.modalCtrl.create({
    component: ListaClientesGuiasPage,
    componentProps:{
      facturas: facturas
    },
    mode: 'ios',
    cssClass: 'example-modal'
  });
  modal.present();
  const { data } = await modal.onDidDismiss();
  console.log(data)
    if(data !== undefined){


    }else{
 
      console.log('false')
    
    }
console.log(this.listaCamionesGuia , 'huia')

}

async listaCamiones(guia){
  const modal = await this.modalCtrl.create({
    component: ListaCapacidadCamionesPage,
    cssClass: 'my-custom-class'
  });
  modal.present();
  const { data } = await modal.onDidDismiss();
  console.log(data)
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
 
      console.log('false')
    
    }
console.log(this.listaCamionesGuia , 'huia')
this.actualizaCamionesData();
}



editRecord(receipt){

  this.listaCamionesGuia.forEach(camion=>{

    camion.facturas.forEach(factura=>{

      if(factura['FACTURA'] == receipt.FACTURA){
        console.log('hello')
      }
    })
  })
}


async loadNewRecordAlert(receipt,guia) {
  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: 'ISLEÑA',
    message: 'Desea generar una nueva guia?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        id: 'cancel-button',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
          this.loadNewRecordExsiting(receipt,guia)
        }
      }, {
        text: 'Si',
        id: 'confirm-button',
        handler: () => {
         
        
          this.listaCamiones(guia);
        }
      }
    ]
  });

  await alert.present();
}







loadExistingRecords(array ){
  console.log(this.listaCamionesGuia, 'loading existing records')
  this.listaCamionesGuia = [];
  


 
array.forEach(factura =>{
console.log(factura ,'existentes')
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
  HH:'',
  volumen:   0,
  facturas: null
}
const i = this.camionesService.camiones.findIndex(c=> c.idCamion == factura.idCamion)
if( i >= 0){
  console.log(this.camionesService.camiones[i], 'chofer')
guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
guia.chofer = this.camionesService.camiones[i].chofer;
}



factura.facturas.forEach(element => {
  guia.zona = factura.zona;
guia.ruta = factura.ruta;
guia.idCamion =factura.idCamion;
guia.peso = factura.peso;
guia.estado = 'RUTA';
guia.HH = 'HH01';
guia.pesoRestante =  factura.pesoRestante;
guia.volumen = factura.volumen;
  guia.facturas.push(element)

  console.log(element,'elemement')
  guia.numClientes = guia.facturas.length;

  if(factura.idCamion == element.idCamion){
    guia.facturas.push(guia.facturas)
    
  }else{
  //  this.listaCamionesGuia.push(guia)
  }
  

});



 })
  


}








































// INSERTAR GUIA

// REMOVER  GUIA

// ACTUALIZAR GUIA






 asignarCamiones(idCamion){

this.listaCamionesGuia = [];

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
  HH:'',
  volumen:   0,
  facturas: null
}
const i = this.camionesService.camiones.findIndex(c=> c.idCamion == idCamion)
if( i >= 0){
guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
guia.chofer = this.camionesService.camiones[i].chofer;
}

  guia.facturas = [];
  this.datableService.data.forEach(factura =>{

factura.CAMION = idCamion;
guia.zona = factura.ZONA;
guia.ruta = factura.RUTA;
guia.idCamion = idCamion;
guia.facturas.push(factura)

guia.peso += factura.TOTAL_PESO;
guia.estado = 'RUTA';
guia.HH = 'HH01';
guia.pesoRestante =   guia.capacidad - factura.TOTAL_PESO;
guia.volumen += factura.TOTAL_VOLUMEN;

})

guia.numClientes = guia.facturas.length;
//this.listaCamionesGuia.push(guia)
console.log( this.camionesService.camiones, 'camiones')
console.log(this.listaCamionesGuia, 'guia')

}

editarCamionesAsignados(factura,camion){



  let guia = {
    idGuia: '',
    chofer: '',
    fecha: new Date(),
    zona: '',
    ruta: '',
    idCamion: camion.idCamion,
    capacidad: 0,
    pesoRestante: 0,
    numClientes: 0,
    peso:  0,
    estado: '',
    HH:'',
    volumen:   0,
    facturas: null
  }
  const i = this.camionesService.camiones.findIndex(c=> c.idCamion == factura.idCamion)
  if( i >= 0){
  guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
  guia.chofer = this.camionesService.camiones[i].chofer;
  }
  
 guia.facturas = [];


for (let i =0; i < this.listaCamionesGuia.length; i++){

  
for( let j = 0; j < this.listaCamionesGuia[i].facturas.length; j++){
if(this.listaCamionesGuia[i].facturas[j]['FACTURA'] == factura.FACTURA){
    
  guia.facturas.push(this.listaCamionesGuia[i].facturas[j]);

}

}
}
    

guia.facturas.forEach(facturas =>{

  facturas.CAMION = camion.idCamion;
  guia.zona = facturas.ZONA;
  guia.ruta = facturas.RUTA;
  guia.idCamion = camion.idCamion;
  guia.peso += facturas.TOTAL_PESO;
  guia.estado = 'RUTA';
  guia.HH = 'HH01';
  guia.pesoRestante =   guia.capacidad - facturas.TOTAL_PESO;
  guia.volumen += facturas.TOTAL_VOLUMEN;
  
  })
  
   //this.listaCamionesGuia.push(guia)
   for (let i =0; i < this.listaCamionesGuia.length; i++){

  
    for( let j = 0; j < this.listaCamionesGuia[i].facturas.length; j++){
    if(this.listaCamionesGuia[i].idCamion != camion.idCamion && this.listaCamionesGuia[i].facturas[j]['FACTURA'] == factura.FACTURA ){
     
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

eliminarCamionesFacturaIndividual(factura){
  const i =  this.datableService.data.findIndex(f=>f.FACTURA == factura.FACTURA);

  if(i >=0){
    this.datableService.data[i].CAMION = ''

  }

  for( let indexA = 0; indexA <this.listaCamionesGuia.length; indexA++ ){
    for( let indexB = 0; indexB <this.listaCamionesGuia[indexA].facturas.length; indexB++ ){

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


  this.listaCamionesGuia.forEach(camion =>{
    camion.facturas.forEach(factura=>{

    })
  })

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
    guia.volumen += factura.TOTAL_VOLUMEN;
    guia.facturas.push(factura)
   
  })
  guia.numClientes = factura.facturas.length;


//this.listaCamionesGuia.push(guia)
})


console.log(this.listaCamionesGuia, 'loaded')



    }

}
