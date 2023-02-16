import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { RuteroService } from 'src/app/services/rutero.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { ActualizaFacLinService } from '../../services/actualizaFacLin';
import { AlertasService } from 'src/app/services/alertas.service';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { CalendarioPage } from '../calendario/calendario.page';
import { format } from 'date-fns';
import { ClientesService } from '../../services/clientes.service';
import { RuteroClientesPage } from '../rutero-clientes/rutero-clientes.page';
import { Rutero } from 'src/app/models/Rutero';
import { Guias } from '../../models/guia';
import { GestionLiquidacionesFacturasPage } from '../gestion-liquidaciones-facturas/gestion-liquidaciones-facturas.page';
 interface guia {
   idGuia: string,
   fecha: any,
   zona: string,
   ruta: string,
   idCamion: string,
   numClientes: number,
   peso: number,
   estado: string,
   HH: string,
   volumen: number

 }
interface guias {
idGuia:string,
totalClientes:number,
chofer:string,
placa:string,
rutero:Rutero,
guia:guia,
estados:{
  color:string,
  completada:number,
  incompleta:number,
  pendiente:number,
  reprogramado:number
},
clientes:Rutero[]
}
@Component({
  selector: 'app-gestion-liquidaciones',
  templateUrl: './gestion-liquidaciones.page.html',
  styleUrls: ['./gestion-liquidaciones.page.scss'],
})
export class GestionLiquidacionesPage implements OnInit {
guia =null;
rutero: guias[]=[]
textoBuscar = ''
fecha =  format(new Date(), 'yyy/MM/dd');
  constructor(
public planificacionEntregasService: PlanificacionEntregasService,
public ruteroService: RuteroService,
public modalCtrl: ModalController,
public gestionCamionesService: GestionCamionesService,
public actualizaFactLinService: ActualizaFacLinService,
public alertasService: AlertasService,
public alerCtrl: AlertController,
public ClientesService: ClientesService
  ) { }

  ngOnInit() {
  }

   

 limpiarDatos(){
  this.guia = null;
  this.rutero = []
  this.textoBuscar =''
  

 }

 ionViewWillEnter(){

  this.limpiarDatos();
}
ngOnDestroy(){
  this.limpiarDatos();
}

async calendarioModal() {

  const modal = await this.modalCtrl.create({
    component: CalendarioPage,
    cssClass: 'ui-modal',
    backdropDismiss: false,
    swipeToClose: false,
    mode: 'ios',
  });
  modal.present();



  const { data } = await modal.onDidDismiss();

  if (data !== undefined) {

  let fecha = format(new Date(data.fecha), 'yyy/MM/dd');
  this.fecha = fecha
   // this.cargarDatos();
   this.limpiarDatos();
   this.alertasService.presentaLoading('Cargando Datos')
   this.ClientesService.syncGetClientesCierre(fecha).then(guias =>{

    if(guias.length ==0){

      this.limpiarDatos()
      this.alertasService.loadingDissmiss()
      this.alertasService.message('IRP','No se encontraron resultados')
      return
    }
console.log('guis', guias)
    let guiasClientes:guias[] = []

    for(let i =0; i < guias.length; i ++){

      let clienteGuia = {
        idGuia: guias[i].idGuia,
        idCliente:  guias[i].idCliente,
        nombre:  guias[i].nombre,
        direccion: guias[i].direccion,
        latitud:guias[i].latitud,
        longitud:guias[i].longitud,
        checkin: new Date( guias[i].checkin),
        latitud_check: guias[i].latitud_check,
        longitud_check: guias[i].longitud_Check,
        observaciones:guias[i].observaciones,
        estado:  guias[i].estado,
        bultos: guias[i].bultos,
        checkout:new Date( guias[i].checkout),
        orden_Visita:  guias[i].orden_Visita,
        Duracion: guias[i].Duracion,
        distancia: guias[i].distancia
     }


     let c = guiasClientes.findIndex(cliente => cliente.idGuia == guias[i].idGuia)
     if( c >=0){
       guiasClientes[c].clientes.push(clienteGuia) 
     }else{

      let guia:guia = {
        idGuia: guias[i].idGuia,
        fecha: guias[i].fecha,
        zona: guias[i].zona,
        ruta: guias[i].ruta,
        idCamion:guias[i].idCamion,
        numClientes: guias[i].numClientes,
        peso: guias[i].peso,
        estado: guias[i].estado,
        HH: guias[i].HH,
        volumen: guias[i].volumen
     
      }
      let rutero:Rutero = {
         idGuia: guias[i].idGuia,
         idCliente: guias[i].idCliente,
         nombre: guias[i].nombre,
         direccion:guias[i].direccion,
         latitud:guias[i].latitud,
         longitud:guias[i].longitud,
         checkin: guias[i].checkin,
         latitud_check: guias[i].latitud_check,
         longitud_check: guias[i].longitud_Check,
         observaciones:guias[i].observaciones,
         estado: guias[i].estado,
         bultos: guias[i].bultos,
         checkout:guias[i].checkout,
         orden_Visita: guias[i].orden_Visita,
         Duracion: guias[i].Duracion,
         distancia: guias[i].distancia
      }

       guiasClientes.push({
        totalClientes:null,
         idGuia:guias[i].idGuia,
         chofer:guias[i].chofer,
         placa:guias[i].idCamion,
         guia:guia,
         rutero:rutero,
         estados:{
          color:null,
          completada:0,
          incompleta:0,
          pendiente:0,
          reprogramado:0
        },
         clientes:[clienteGuia]
}) 
     }


      if(i == guias.length -1){

        // Verificamos que no hayan resultados de x estado en caso de haber entonces se marca como pendiente

        guiasClientes.forEach((guia, index) => {
let color = null;
let totalClientes = guia.clientes.length;
let totalEstadoE =   guia.clientes.filter(g => g.estado == 'E').length
let totalEstadoI =   guia.clientes.filter(g => g.estado == 'I').length
let totalEstadoP =   guia.clientes.filter(g => g.estado == 'P').length
let totalEstadoR =   guia.clientes.filter(g => g.estado == 'R').length

if(totalClientes == totalEstadoE){

color = 'success'
}else if (totalEstadoI > 0){
  color = 'warning'

}else{
  color = 'danger'
}

guia.totalClientes = totalClientes;
guia.estados.color = color;
guia.estados.completada = totalEstadoE;
guia.estados.incompleta = totalEstadoI;
guia.estados.pendiente = totalEstadoP;
guia.estados.reprogramado = totalEstadoR;
console.log(

  'totalClientes' , totalClientes, 'totalEstadoE',totalEstadoE,'totalEstadoI',totalEstadoI,'totalEstadoP',totalEstadoP,'totalEstadoR',totalEstadoR
)

if(index == guiasClientes.length -1){
  this.rutero = guiasClientes;
  this.rutero.sort((a,b)=>+a.idGuia - +b.idGuia)
  console.log('guiasClientes', guiasClientes)
}

        })
    

      }
    }



this.alertasService.loadingDissmiss();



   }, error =>{
    this.alertasService.loadingDissmiss();
   })

  }
}
onSearchChange(event){
  this.textoBuscar = event.detail.value;

}
async ruteroClientes(rutero:Guias) {
console.log('rutero', rutero)
  const modal = await this.modalCtrl.create({
    component: RuteroClientesPage,
    cssClass: 'ui-modal',
    backdropDismiss: false,
    swipeToClose: false,
    mode: 'ios',
    componentProps:{
      guia:rutero.idGuia,
      ruteroInput:rutero.clientes
    }
  });
  modal.present();



  const { data } = await modal.onDidDismiss();

  if (data !== undefined) {



  }
}
async guiaFacturas(rutero:Guias) {
  console.log('rutero', rutero)
    const modal = await this.modalCtrl.create({
      component: GestionLiquidacionesFacturasPage,
      cssClass: 'ui-modal',
      backdropDismiss: false,
      swipeToClose: false,
      mode: 'ios',
      componentProps:{
        guia:rutero,
        fecha: new Date(this.fecha).toISOString()
      }
    });
    modal.present();
  
  
  
    const { data } = await modal.onDidDismiss();
  
    if (data !== undefined) {
  
  
  
    }
  }



isIos() {
  const win = window as any;
  return win && win.Ionic && win.Ionic.mode === 'ios';
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
            this.planificacionEntregasService.putGuiaToPromise(this.guia).then(resp =>{
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
