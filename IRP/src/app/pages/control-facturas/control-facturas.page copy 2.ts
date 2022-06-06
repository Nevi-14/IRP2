import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { GuiasService } from 'src/app/services/guias.service';
import { RuteroService } from 'src/app/services/rutero.service';
interface modeloCamiones {
  placa:string,
  chofer:string,
  volumen:number,
  peso:number,
  numeroGuia:string,
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
      this.consultas.nuevaGuia = false;
      this.consultas.otrasGuias = false;
      this.consultas.guiaExistente = true;
      this.camiones = [];
      this.controlCamionesGuiasService.listaGuias.forEach(camion =>{
        const  camionRuta = {
  
          placa: camion.camion.idCamion,
          chofer:camion.camion.chofer,
          volumen:camion.camion.volumen,
          peso:camion.camion.peso,
          numeroGuia:camion.idGuia,
          frio:camion.camion.frio,
          seco:camion.camion.seco,
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
            this.controlCamionesGuiasService.borrarFactura(this.factura);
          

          }
        }
      ]
    });
  
    await alert.present();
  }

  retornarCamion(camion){

    

/**
 * for(let i = 0; i <  this.controlCamionesGuiasService.listaGuias.length; i++){

  if( this.controlCamionesGuiasService.listaGuias[i].idGuia != camion.placa){
    this.controlCamionesGuiasService.listaGuias.splice(i,1);

  }
}
 */


    if(this.consultas.incluirFacturas){
      this.controlCamionesGuiasService.listaGuias = [];
      console.log(this.facturas)
for (let i =0; i < this.facturas.length; i++)

if(i === 1){
  console.log( this.facturas[i], ' this.facturas')
  
  this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false,this.facturas)
}

return
    }
    
    
    if(this.consultas.nuevaGuia || this.consultas.otrasGuias){


      if( this.consultas.otrasGuias){
         // CARGAMOS RUTERO
this.alertasService.presentaLoading('Consultando rutero');
        const ruteros =   this.ruteroService.syncRutero(camion.numeroGuia)
        ruteros.then(rutero =>{
          this.alertasService.loadingDissmiss();
        
          console.log('ruterosss', rutero)
          this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false, [this.factura])

          const guiaCamion = { 
            idGuia:camion.numeroGuia,
            fecha: camion.fecha,
            zona: camion.zona,
            ruta: camion.ruta,
            idCamion: camion.idCamion,
            numClientes: camion.numClientes,
            peso: camion.peso,
            estado:  camion.estado,
            HH: camion.HH,
            volumen: camion.volumen
           }

    
           this.gestionCamionesService.syncGetFacturasGuia(camion.numeroGuia).then(resp =>{
            console.log('retornar camion', camion)
            console.log('guiaCamion', guiaCamion)
            console.log('ruteros', ruteros)
            console.log('facturas', resp)
           })
          
     
              // EFECTUAMOS EL PUT DE GUIA

     /**
      *         this.guiasService.putGuias(guiaCamion).then(resp =>{
                  
              this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false, [this.factura])

             }), error =>{
                  
                  
          
             console.log(error)
                   
                  }
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

      }else{

        this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false, [this.factura])
      }
   
      
    }else if(this.consultas.guiaExistente){
      this.controlCamionesGuiasService.agregarFacturaGuia(this.factura,camion, camion.numeroGuia)

    }

    console.log(this.controlCamionesGuiasService.listaGuias, 'listaGuias')
   this.cerrarModal()
  
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  incluirFacturasEvent($event){
    if($event.detail.checked){

    
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

        placa: camion.camion.idCamion,
        chofer:camion.camion.chofer,
        volumen:camion.camion.volumen,
        peso:camion.camion.peso,
        numeroGuia:camion.idGuia,
        frio:camion.camion.frio,
        seco:camion.camion.seco,
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

        placa: String(camion.idCamion),
        chofer:camion.chofer,
        volumen:camion.capacidadVolumen,
        peso:camion.capacidadPeso,
        numeroGuia:null,
        frio:camion.frio,
        seco:camion.seco,
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


      const datosCamion = this.gestionCamiones.camiones.findIndex(camion => camion.idCamion == camion.idCamion )

if(datosCamion >=0){
const  camionRuta = {

  placa: camion.idCamion,
  chofer:this.gestionCamiones.camiones[datosCamion].chofer,
  volumen:camion.volumen,
  peso:camion.peso,
  numeroGuia:camion.idGuia,
  frio:this.gestionCamiones.camiones[datosCamion].frio,
  seco:this.gestionCamiones.camiones[datosCamion].seco,
}


if(camion.estado == 'INI'){
  
  console.log(camion, ' camion otras guias')
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


}
