import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ClientesGuia, Guias } from 'src/app/models/guia';
import { GuiaEntrega } from 'src/app/models/guiaEntrega';
import { PlanificacionEntregas } from 'src/app/models/planificacionEntregas';
import { AlertasService } from 'src/app/services/alertas.service';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
 
import { RuteroService } from 'src/app/services/rutero.service';
import { FacturasNoAgregadasPage } from '../facturas-no-agregadas/facturas-no-agregadas.page';


@Component({
  selector: 'app-control-facturas',
  templateUrl: './control-facturas.page.html',
  styleUrls: ['./control-facturas.page.scss'],
})
export class ControlFacturasPage implements OnInit {
  @Input() factura:PlanificacionEntregas =   null
  @Input() facturas:ClientesGuia[] = []
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
    public gestionCamiones: GestionCamionesService,
    public modalCtrl: ModalController,
    public ruteroService: RuteroService,
    public alertasService: AlertasService,
    public gestionCamionesService: GestionCamionesService,
    public planificacionEntregasService: PlanificacionEntregasService
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
    if(this.planificacionEntregasService.listaGuias.length > 0 ){
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
        facturas:this.planificacionEntregasService.facturasNoAgregadas
      }
    });
    modal.present();
  
 
  
  
      
  }
  async retornarCamion(camion:any){


    this.planificacionEntregasService.facturasNoAgregadas = [];
    let id = this.planificacionEntregasService.generarIDGuia();

 if(this.listaGuias){
  camion.idGuia = id;
  camion.camion.numeroGuia =id;
  if(this.incluirFacturas){
  
    this.planificacionEntregasService.listaGuias.push(camion);

    for(let i =0; i< this.facturasArray.length; i++){

      let facturasArray2 = this.facturasArray[i].facturas;
      facturasArray2.forEach(factu  => {

        if(factu.ID_GUIA   ){

          this.planificacionEntregasService.borrarFacturaGuia(factu)
        }
  if(factu.LONGITUD && factu.LATITUD){

    this.planificacionEntregasService.agregarFacturaGuiaNueva(camion.idGuia, factu);
  }
     
      })


      if(i == this.facturasArray.length -1 ){
      this.modalCtrl.dismiss()
      console.log('this.planificacionEntregasService.facturasNoAgregadas', this.planificacionEntregasService.facturasNoAgregadas)
   //   this.planificacionEntregasService.actualizarValores();
   
setTimeout(()=>{
  //this.alertasService.presentaLoading('Validando datos..')
  if(this.planificacionEntregasService.facturasNoAgregadas.length >0){
    this.facturasNoAgregadas()
    console.log('this.planificacionEntregasService.facturasNoAgregadas', this.planificacionEntregasService.facturasNoAgregadas)
//this.alertasService.loadingDissmiss();

    return
  }
}, 3000)
       
  
      }
    }
   
  return
    }



    
   
    if(this.factura.ID_GUIA){

      console.log('deleting', this.factura.ID_GUIA)
      this.planificacionEntregasService.borrarFacturaGuia(this.factura)
    }
 

  this.planificacionEntregasService.listaGuias.push(camion);
 
  if(this.factura.LONGITUD && this.factura.LATITUD){

    this.planificacionEntregasService.agregarFacturaGuiaNueva(camion.idGuia, this.factura);
  }

  this.planificacionEntregasService.actualizarTotales();
  
  this.cerrarModal();
  return
 }


 if(this.listaGuiasExistentes){
  
if(this.incluirFacturas){

    for(let i =0; i< this.facturasArray.length; i++){

      let facturasArray2 = this.facturasArray[i].facturas;
      facturasArray2.forEach(factu  => {

        if(factu.ID_GUIA   && factu.ID_GUIA != camion.idGuia ){
 
          this.planificacionEntregasService.borrarFacturaGuia(factu)
        }

        if(factu.LONGITUD && factu.LATITUD){
          this.planificacionEntregasService.agregarFacturaGuiaNueva(camion.idGuia, factu);
        }
      
      })

      if(i == this.facturasArray.length -1 ){
      this.modalCtrl.dismiss()
      this.planificacionEntregasService.actualizarTotales();

        if(this.planificacionEntregasService.facturasNoAgregadas.length >0){
  
 this.facturasNoAgregadas()
  
 
        }
  
      }
    }
   
    return
 
    }
    
    this.planificacionEntregasService.agregarFacturaGuiaNueva(camion.idGuia, this.factura);
    this.planificacionEntregasService.actualizarTotales();
    
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
      
          this.planificacionEntregasService.generarPreListaGuias(camiones).then(lista =>{
    
            this.guias = lista;
            console.log('lista nueva', lista)
          })
    
        });

      }

      guiasExistentes(){
        this.guias = this.planificacionEntregasService.listaGuias;
        console.log('guias existentes', this.planificacionEntregasService.listaGuias)
      }

     
}
