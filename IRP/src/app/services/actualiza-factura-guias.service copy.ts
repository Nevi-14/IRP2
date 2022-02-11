import { Injectable } from '@angular/core';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { GuiaEntrega } from '../models/guiaEntrega';
import { DataTableService } from './data-table.service';
import { GestionCamionesService } from './gestion-camiones.service';
import { RutaFacturasService } from './ruta-facturas.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ListaCapacidadCamionesPage } from '../pages/lista-capacidad-camiones/lista-capacidad-camiones.page';

@Injectable({
  providedIn: 'root'
})
export class ActualizaFacturaGuiasService {

  actualizaGuiaFacturaArray : ActualizaFacturaGuia[]=[];
  listaCamionesGuia: GuiaEntrega[] = [];
  guia:GuiaEntrega;
 constructor( private rutasFacturasService: RutaFacturasService, public datableService:DataTableService, public camionesService:GestionCamionesService, public alertCtrl: AlertController, public modalCtrl: ModalController) {
  

 }


// CARGAR GUIAS 



loadData(array, truck, reload){


 if(reload){

 this.listaCamionesGuia = []

  }else{




  }



}


loadNewRecords(array , truck){


  let guia = {
    idGuia: '',
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
 }

guia.facturas = [];

array.forEach(factura =>{
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
  this.listaCamionesGuia.push(guia)
}


loadNewRecord(receipt ){

  let guia = {
    idGuia: '',
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
 const i = this.camionesService.camiones.findIndex(c=> c.idCamion == receipt.idCamion)
 if( i >= 0){
guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
 }



guia.facturas = [];

guia.facturas.push(receipt)
guia.zona = receipt.ZONA;
guia.ruta = receipt.RUTA;
guia.idCamion = receipt.idCamion;
guia.peso += receipt.TOTAL_PESO;
guia.estado = 'RUTA';
guia.HH = 'HH01';
guia.pesoRestante =   guia.capacidad - receipt.TOTAL_PESO;
guia.volumen += receipt.TOTAL_VOLUMEN;

guia.numClientes = guia.facturas.length;



this.loadNewRecordAlert(receipt,guia,'nuevo');


}







async loadNewRecordAlert(receipt,guia ,action) {
  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: 'PLANIFICACIÓN DE ENTREGAS',
    message: 'Desea generar una nueva guia!',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        id: 'cancel-button',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Si',
        id: 'confirm-button',
        async   handler ()  {
          const modal = await this.modalCtrl.create({
            component: ListaCapacidadCamionesPage,
            componentProps:{
              factura: receipt
            },
            cssClass: 'my-custom-class'
          });
          const { data } = await modal.onDidDismiss();
          console.log(data)
            if(data !== undefined){
              
              switch(action){
                case 'nuevo':
                  break;
              }
        
            }else{
         
            
            
            }
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
guia.facturas = [];

const i = this.camionesService.camiones.findIndex(c=> c.idCamion == factura.idCamion)
if( i >= 0){
guia.capacidad = this.camionesService.camiones[i].capacidadPeso;
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
    this.listaCamionesGuia.push(guia)
  }
  

});



 })
  


}








































// INSERTAR GUIA

// REMOVER  GUIA

// ACTUALIZAR GUIA






 mostrarClientes(guia){

  console.log(guia)



 }


 asignarCamiones(idCamion){

this.listaCamionesGuia = [];

  const camion = this.camionesService.camiones.findIndex(c=> c.idCamion == idCamion)
   
  
  let guia = {
    idGuia: '',
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

  if( camion >= 0){
    guia.capacidad = this.camionesService.camiones[camion].capacidadPeso;
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
this.listaCamionesGuia.push(guia)
console.log( this.camionesService.camiones, 'camiones')
console.log(this.listaCamionesGuia, 'guia')

}

editarCamionesAsignados(factura,camion){


  const camionIndex = this.camionesService.camiones.findIndex(c=> c.idCamion == camion.idCamion)
   
  let guia = {
    idGuia: '',
    fecha: new Date(),
    zona: factura.ZONA,
    ruta: factura.RUTA,
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
 if( camionIndex >= 0){
  guia.capacidad = this.camionesService.camiones[camionIndex].capacidadPeso;
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
  
   this.listaCamionesGuia.push(guia)
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


this.listaCamionesGuia.push(guia)
})


console.log(this.listaCamionesGuia, 'loaded')



    }

}
