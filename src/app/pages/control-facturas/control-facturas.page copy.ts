import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { GuiaEntrega } from 'src/app/models/guiaEntrega';
import { AlertasService } from 'src/app/services/alertas.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { GuiasService } from 'src/app/services/guias.service';
import { RuteroService } from 'src/app/services/rutero.service';
interface modeloCamiones {
  idGuia:string,
  numeroGuia:string,
  fecha:Date,
  zona:string,
  ruta:string,
  idCamion:string,
  numClientes:number,
  peso:number,
  estado:string,
  HH:string,
  volumen:number,
  chofer:string,
  frio:string,
  seco:string

}
@Component({
  selector: 'app-control-facturas',
  templateUrl: './control-facturas.page.html',
  styleUrls: ['./control-facturas.page.scss'],
})
export class ControlFacturasPage implements OnInit {
@Input() factura:any
@Input() facturas:any
  consultas = {
    nuevaGuia: true,
    guiaExistente:false,
    otrasGuias:false,
    incluirFacturas: false
  }
  guiaEnRuta:GuiaEntrega;
  camiones :modeloCamiones[]= [];
  verdadero = true;
  falso = false;
  textoBuscar = '';
  constructor(
    public alertCTrl: AlertController,
    public controlCamionesGuiasService: ControlCamionesGuiasService,
    public guiasService: GuiasService,
    public gestionCamiones: GestionCamionesService,
    public modalCtrl: ModalController,
    public ruteroService: RuteroService,
    public alertasService: AlertasService,
    public gestionCamionesService: GestionCamionesService
  ) { }

  ngOnInit() {
    if(this.controlCamionesGuiasService.listaGuias.length > 0){
      this.guiaEnRuta = null;
      this.consultas.nuevaGuia = false;
      this.consultas.otrasGuias = false;
      this.consultas.guiaExistente = true;
      this.camiones = [];
      this.controlCamionesGuiasService.listaGuias.forEach(camion =>{
       
        const  camionRuta = {
          idGuia:camion.idGuia,
          numeroGuia:camion.idGuia,
          fecha:new Date(),
          zona:camion.zona,
          ruta:camion.ruta,
          idCamion:camion.camion.idCamion,
          numClientes:camion.numClientes,
          peso:camion.camion.peso,
          estado:camion.camion.estado,
          HH:camion.camion.HH,
          volumen:camion.camion.volumen,
          chofer:camion.camion.chofer,
          frio:camion.camion.frio,
          seco:camion.camion.seco
        }


        this.camiones.push(camionRuta)
        console.log(this.camiones, 'guiasExistentes')
  
    
      })
    }else{

      this.gestionCamiones.syncCamiones();
    }
 
  this.nuevaGuia(this.consultas.nuevaGuia);
  
    console.log(this.factura,'factura',this.facturas,'facturas')
  }

  async borrarFactura(){
    const alert = await this.alertCTrl.create({
      cssClass: 'my-custom-class',
      header: 'Planificacion Entregas!',
      message: `Desea eliminar la factura del registro de guias`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Continuar',
          id: 'confirm-button',
          handler: () => {
            this.factura.factura.TIPO_DOCUMENTO = 'F';
            this.controlCamionesGuiasService.borrarFactura(this.factura);
          

          }
        }
      ]
    });
  
    await alert.present();
  }

 async retornarCamion(camion){
console.log(this.consultas)

   

 if(this.consultas.incluirFacturas){
      this.controlCamionesGuiasService.listaGuias = [];
      console.log(this.facturas)
      console.log('retonar cmaion',  this.facturas)
for (let i =0; i < this.facturas.length; i++){

 
  if(i === 1){

    this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false,this.facturas)
  }
  
  return

}




    }
    
    
    if(this.consultas.nuevaGuia || this.consultas.otrasGuias){


      if( this.consultas.otrasGuias){
        const alert = await this.alertCTrl.create({
          cssClass: 'my-custom-class',
          header: 'Planificacion Entregas!',
          message: `Guia en proceso de inicio, al continuar volveremos a recrear la guia con un consecutivo nuevo, manteniendo las facturas y clientes originales`,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              id: 'cancel-button',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Continuar',
              id: 'confirm-button',
              handler: () => {
                this.cerrarModal()
                      // CARGAMOS RUTERO
this.alertasService.presentaLoading('Consultando rutero');
this.ruteroService.syncRutero(camion.numeroGuia).then(rutero =>{
 const ruteros =  rutero;
     this.alertasService.loadingDissmiss();
     const guiaCamion = { 
       idGuia:camion.numeroGuia,
       fecha: camion.fecha,
       zona: camion.zona,
       ruta: camion.ruta,
       idCamion: camion.idCamion,
       numClientes: camion.numClientes,
       peso: camion.peso,
       estado: 'DEL',
       HH: camion.HH,
       volumen: camion.volumen
      }

   
     this.guiasService.putGuias(guiaCamion).then(resp =>{
       this.gestionCamionesService.syncGetFacturasGuia(camion.numeroGuia).then(resp =>{
         const facturas:any[] = [];
        console.log('retornar camion', camion)
        console.log('guiaCamion', guiaCamion)
        console.log('ruteros', ruteros)
        console.log('facturas', resp)
    

        facturas.push(this.factura)
        for(let i =0; i < resp.length; i++){
       
facturas.push({idGuia: '', factura: resp[i]})
if(i === resp.length -1){
this.controlCamionesGuiasService.generarGuiaEnRuta(guiaCamion,ruteros,facturas);
}
        }

 
       })
    
      }), error =>{
           
           
   
      console.log(error)
            
           }


 



     
     
// this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false, [this.factura])
         // EFECTUAMOS EL PUT DE GUIA

/**
 *    
 */
     


   }), error =>{
     this.alertasService.loadingDissmiss();
     let errorObject = {
       titulo: 'this.ruteroService.syncRutero(data.idGuia)',
       fecha: new Date(),
       metodo:'GET',
       url:error.url,
       message:error.message,
       rutaError:'app/services/rutero-service.ts',
       json:JSON.stringify('')
     }
   
     
     console.log(error)
    
   }
              
    
              }
            }
          ]
        });
      
        await alert.present();
  
    


      }else{

        this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false, [this.factura])
        this.cerrarModal()
      }
   
      
    }else if(this.consultas.guiaExistente){
     
      this.controlCamionesGuiasService.agregarFacturaGuia(this.factura,camion, camion.numeroGuia)
 
      this.cerrarModal()

  

    }

    console.log(this.controlCamionesGuiasService.listaGuias, 'listaGuias')

  
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }




  incluirFacturasEvent($event){
    console.log($event.detail.checked)
    if($event.detail.checked){

    this.consultas.incluirFacturas = $event.detail.checked;
    }


  }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;
    
   }

  guiasExistentes($event){ 


    if($event.detail.checked){
      
     this.consultas.nuevaGuia = false;
    this.consultas.otrasGuias = false;
    this.camiones = [];

    this.controlCamionesGuiasService.listaGuias.forEach(camion =>{

      console.log(camion, ' camion guia existente')
 

      const  camionRuta = {
        idGuia:camion.idGuia,
        numeroGuia:camion.idGuia,
        fecha:new Date(),
        zona:camion.zona,
        ruta:camion.ruta,
        idCamion:camion.camion.idCamion,
        numClientes:camion.numClientes,
        peso:camion.camion.peso,
        estado:camion.camion.estado,
        HH:camion.camion.HH,
        volumen:camion.camion.volumen,
        chofer:camion.camion.chofer,
        frio:camion.camion.frio,
        seco:camion.camion.seco
      }

      this.camiones.push(camionRuta)
      console.log(this.camiones, 'guiasExistentes')

  
    })
  }
  }
  nuevaGuia(validate){


if(validate){

  this.consultas.guiaExistente = false;
  this.consultas.otrasGuias = false;

  this.camiones = [];
  this.gestionCamiones.syncPromiseCamiones().then(resp =>{


    console.log(resp,'nuevaGuia')
    resp.forEach(camion =>{
      const  camionRuta = {
        idGuia:'',
        numeroGuia:'',
        fecha:new Date(),
        zona:'',
        ruta:'',
        idCamion:camion.idCamion,
        numClientes:0,
        peso:camion.capacidadPeso,
        estado:'INI',
        HH:'INI',
        volumen:camion.capacidadVolumen,
        chofer:camion.chofer,
        frio:camion.frio,
        seco:camion.seco
      }

      this.camiones.push(camionRuta)
      console.log(this.controlCamionesGuiasService.listaGuias, 'listaGuias')

  
    })
  })

}
  }

  otrasGuias($event){

if($event.detail.checked){
  this.camiones = []
  this.consultas.nuevaGuia = false;
  this.consultas.guiaExistente = false;
  this.guiasService.syncGuiasEnRutaPromise('INI').then(resp =>{

    resp.forEach(camion =>{

      console.log('camioncamioncamion', camion)

      const camiones =  this.gestionCamiones.camiones;
          
      for(let i =0; i < camiones.length; i++){

        if(camiones[i].idCamion === camion.idCamion){
  
          const  camionRuta = {
            idGuia:camion.idGuia,
            numeroGuia:camion.idGuia,
            fecha:camion.fecha,
            zona:camion.zona,
            ruta:camion.ruta,
            idCamion:camion.idCamion,
            numClientes:camion.numClientes,
            peso:camion.peso,
            estado:camion.estado,
            HH:camion.HH,
            volumen:camion.volumen,
            chofer:camiones[i].chofer,
            frio:camiones[i].frio,
            seco:camiones[i].seco
          }
          
          this.camiones.push(camionRuta)
        }

      }


  
    })
  
   console.log( this.gestionCamiones.camiones,'otrasGuias')

            })

} else{
  this.camiones = [];
}


  }

  generarGuiaExterna(camion){





  }


}
