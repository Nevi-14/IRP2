import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { GuiaEntrega } from 'src/app/models/guiaEntrega';
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
interface camiones {
  idCamion: string,
  descripcion: string,
marca: string,
  modelo:string,
  propietario:string,
  capacidadPeso:number,
  capacidadVolumen: number,
  activo:string,
  frio: string,
  seco: string,
  chofer: string,
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
  camionesExistentes :GuiaEntrega[]= [];
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
        const  camionRuta:any = {
  
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

      this.gestionCamiones.syncCamionesToPromise().then(resp =>{
        this.camiones = [];
        resp.forEach(camion =>{
          const  camionRuta:any = {
    
            placa: camion.idCamion,
            chofer:camion.chofer,
            volumen:camion.capacidadVolumen,
            peso:camion.capacidadPeso,
            numeroGuia: camion.idCamion,
            frio:camion.frio,
            seco:camion.seco,
          }
          this.camiones.push(camionRuta)
               console.log(this.camiones, 'guiasExistentes')
    
      
        })

      });
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

 if(this.consultas.incluirFacturas){
      this.controlCamionesGuiasService.listaGuias = [];
      console.log(this.facturas)
for (let i =0; i < this.facturas.length; i++)

if(i === 1){
console.log(camion,'camamama')
//  this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false,this.facturas)
}

return
    }
    
    console.log(camion,'camamama')
    if(this.consultas.nuevaGuia || this.consultas.otrasGuias){


      if( this.consultas.otrasGuias){
         // CARGAMOS RUTERO
 /**
  * 
  */
      }else{

       this.controlCamionesGuiasService.generarGuia(camion, this.consultas.otrasGuias ? this.consultas.otrasGuias  : false, [this.factura])
      }
   
      
    }else if(this.consultas.guiaExistente){
   //   this.controlCamionesGuiasService.agregarFacturaGuia(this.factura,camion, camion.numeroGuia)

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
     // this.camiones.push(camionRuta)
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
        volumen:0,
        peso:0,
        numeroGuia:null,
        frio:camion.frio,
        seco:camion.seco,
      }
    //  this.camiones.push(camionRuta)
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

      if(camion.estado == 'INI'){
        const camionGuia = camion
        console.log(camionGuia, 'this.gestionCamiones.camiones[datosCamion]')
      this.camionesExistentes.push(camion)
      }


      console.log('camioncamioncamioncamioncamioncamion', camion)

      const datosCamion = this.gestionCamiones.camiones.findIndex(camion => camion.idCamion == camion.idCamion )

if(datosCamion >=0){
/**
 * const  camionRuta = {

  placa: camion.idCamion,
  chofer:this.gestionCamiones.camiones[datosCamion].chofer,
  volumen:camion.volumen,
  peso:camion.peso,
  numeroGuia:camion.idGuia,
  frio:this.gestionCamiones.camiones[datosCamion].frio,
  seco:this.gestionCamiones.camiones[datosCamion].seco,
}

 */

if(camion.estado == 'INI'){
  const camionGuia = this.gestionCamiones.camiones[datosCamion]
  console.log(camion, 'camion init end')
this.camionesExistentes.push(camion)
}

}
  
    })
  


            })

} else{
  this.camiones = [];
}


  }


}
