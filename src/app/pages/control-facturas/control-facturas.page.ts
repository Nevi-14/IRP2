import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ClientesGuia, Guias } from 'src/app/models/guia';
import { GuiaEntrega } from 'src/app/models/guiaEntrega';
import { PlanificacionEntregas } from 'src/app/models/planificacionEntregas';
import { AlertasService } from 'src/app/services/alertas.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { GuiasService } from 'src/app/services/guias.service';
import { RuteroService } from 'src/app/services/rutero.service';
import { FacturasNoAgregadasPage } from '../facturas-no-agregadas/facturas-no-agregadas.page';


@Component({
  selector: 'app-control-facturas',
  templateUrl: './control-facturas.page.html',
  styleUrls: ['./control-facturas.page.scss'],
})
export class ControlFacturasPage implements OnInit {
  @Input() factura:PlanificacionEntregas
  @Input() facturas:ClientesGuia[]
  facturasOriginal:ClientesGuia[] = [];
  facturasArray:ClientesGuia[] = [];
  guias:Guias[]=[];
 titulo = null;
  listaGuias:boolean = true;
  listaOtrasGuias:boolean = false;
  listaGuiasExistentes:boolean = false;
  incluirFacturas:boolean = false;

  guiaEnRuta:GuiaEntrega;
  camiones  = [];
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

    console.log(' this.facturas',  this.facturas)

    if(this.factura == null){
      this.listaGuias = true;
      this.incluirFacturas = true;
this.facturasArray = this.facturas

this.guiasNuevas();
console.log('this.facturas', this.facturas)
      return
    }
 this.titulo = this.factura.NOMBRE_CLIENTE;

 console.log(this.facturas, 'facturas')
    if(this.controlCamionesGuiasService.listaGuias.length > 0 ){
      this.listaGuiasExistentes = true
      this.listaGuias = false;
      this.listaOtrasGuias = false;

this.guiasExistentes();

    }else{
      this.listaGuias = true;
      this.listaGuiasExistentes = false
      this.listaOtrasGuias = false;
      this.guiasNuevas();
    }
  }



  onSearchChange(event){
    this.textoBuscar = event.detail.value;
    
   }

  agregarTodasFacturas($event){
    this.facturasArray = [];
console.log($event)
 let next  = $event.detail.checked;
 this.incluirFacturas = next;
 if(next){
  this.incluirFacturas = true;
  console.log(' this.facturas', this.facturas)
  this.facturasArray = this.facturas

 } 

  
  }

  async facturasNoAgregadas(){
  
    const modal = await this.modalCtrl.create({
      component: FacturasNoAgregadasPage,
      cssClass: 'ui-modal',
      componentProps:{
        facturas:this.controlCamionesGuiasService.facturasNoAgregadas
      }
    });
    modal.present();
  
 
  
  
      
  }
  async retornarCamion(camion:any){


    this.controlCamionesGuiasService.facturasNoAgregadas = [];
    let id = this.controlCamionesGuiasService.generarIDGuia();

    console.log('this.factura', this.factura)
    console.log('this.facturasArray', this.facturasArray)

  
  

 if(this.listaGuias){
  camion.idGuia = id;
  camion.camion.numeroGuia =id;
  if(this.incluirFacturas){
  
  
    this.controlCamionesGuiasService.listaGuias.push(camion);
    console.log('camion', camion)
    for(let i =0; i< this.facturasArray.length; i++){
console.log('this.facturasArray', this.facturasArray)
      let facturasArray2 = this.facturasArray[i].facturas;
      facturasArray2.forEach(factu  => {
console.log('facturaaaaa inmpor', factu)
        if(factu.ID_GUIA   ){
 console.log('deleting')
          this.controlCamionesGuiasService.borrarFacturaGuia(factu)
        }
  
        this.controlCamionesGuiasService.agregarFacturaGuiaNueva(camion.idGuia, factu);
      })


      if(i == this.facturasArray.length -1 ){
      this.modalCtrl.dismiss()
 
   //   this.controlCamionesGuiasService.actualizarValores();
        if(this.controlCamionesGuiasService.facturasNoAgregadas.length >0){
          

 this.facturasNoAgregadas()
  
  console.log('this.controlCamionesGuiasService.facturasNoAgregadas', this.controlCamionesGuiasService.facturasNoAgregadas)
          return
        }
  
      }
    }
   
  return
    }



    
   
    if(this.factura.ID_GUIA){

      console.log('deleting', this.factura.ID_GUIA)
      this.controlCamionesGuiasService.borrarFacturaGuia(this.factura)
    }
 

  this.controlCamionesGuiasService.listaGuias.push(camion);
  this.controlCamionesGuiasService.agregarFacturaGuiaNueva(camion.idGuia , this.factura);

  this.controlCamionesGuiasService.actualizarValores();
  
  this.cerrarModal();
  return
 }


 if(this.listaGuiasExistentes){
  
if(this.incluirFacturas){

    for(let i =0; i< this.facturasArray.length; i++){

      let facturasArray2 = this.facturasArray[i].facturas;
      facturasArray2.forEach(factu  => {

        if(factu.ID_GUIA   && factu.ID_GUIA != camion.idGuia ){
 
          this.controlCamionesGuiasService.borrarFacturaGuia(factu)
        }
        this.controlCamionesGuiasService.agregarFacturaGuiaNueva(camion.idGuia, factu);
      })

      if(i == this.facturasArray.length -1 ){
      this.modalCtrl.dismiss()
      this.controlCamionesGuiasService.actualizarValores();

        if(this.controlCamionesGuiasService.facturasNoAgregadas.length >0){
  
 this.facturasNoAgregadas()
  
 
        }
  
      }
    }
   
    return
 
    }
    
    this.controlCamionesGuiasService.agregarFacturaGuiaNueva(camion.idGuia, this.factura);
    this.controlCamionesGuiasService.actualizarValores();
    
  this.cerrarModal();
}
 

  
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  toggleGuiasNuevas($event){
    if($event.detail.checked){
      this.listaGuias = true;
      this.listaGuiasExistentes = false
     this.listaOtrasGuias = false;
      this.guiasNuevas();
    }
  }
  toggleGuiasExistentes($event){ 


    if($event.detail.checked){
     this.listaGuias = false;
     this.listaOtrasGuias = false;
     this.listaGuiasExistentes = true
    this.guiasExistentes();
    }
  }
 


      guiasNuevas(){
        this.gestionCamionesService.syncCamionesToPromise().then(camiones =>{
      
          this.controlCamionesGuiasService.generarPreListaGuias(camiones).then(lista =>{
    
            this.guias = lista;
            console.log('lista nueva', lista)
          })
    
        });

      }

      guiasExistentes(){
        this.guias = this.controlCamionesGuiasService.listaGuias;
        console.log('guias existentes', this.controlCamionesGuiasService.listaGuias)
      }

     
}
