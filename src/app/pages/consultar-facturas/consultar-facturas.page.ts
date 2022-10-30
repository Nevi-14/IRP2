import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { RutaZonaService } from '../../services/ruta-zona.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { format } from 'date-fns';
import { PlanificacionEntregas } from 'src/app/models/planificacionEntregas';
import { AlertasService } from 'src/app/services/alertas.service';
interface facturas {
  factura: PlanificacionEntregas,
  checked:boolean
}
interface Clientes {
  id: number,
  nombre: string,
  facturas:facturas[]
}

@Component({
  selector: 'app-consultar-facturas',
  templateUrl: './consultar-facturas.page.html',
  styleUrls: ['./consultar-facturas.page.scss'],
})
export class ConsultarFacturasPage implements OnInit {
  textoBuscar = '';
  ruta = null;
  clientes:Clientes[] = []
  rutas = []
  date = new Date();
  constructor(
   public modalCtrl: ModalController,
   public rutaZonasService: RutaZonaService,
   public popOverCtrl:PopoverController,
   public planificacionEntregasService: PlanificacionEntregasService,
   public alertasService:AlertasService
  ) { }
 
selectedArray :any = [];
  ngOnInit() {
    this.cargarListaClientes();
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  seleccionarCliente($event){
let ruta = $event.detail.value;
 this.ruta = ruta;

 this.cargarDatos();
  }

  cargarListaClientes(){
    this.ruta = null;
    this.rutaZonasService.syncRutasToPromise().then(resp =>{


      resp.forEach(element => {
        let ruta =
        {Ruta: element.Ruta, Zona: element.Zona,Descripcion:element.Descripcion, checked: false}
        this.rutas.push(ruta)
      });
     
     
    })
 
     //this.unCheckAll();
      }
 

selectMember(factura:facturas){

  console.log(factura)
 if (factura.checked == false) {
    this.selectedArray.push(factura);
  } else {
   let newArray = this.selectedArray.filter(function(el) {
     return el.factura.FACTURA !== factura.factura.FACTURA;
  });
   this.selectedArray = newArray;
 }
 console.log(this.selectedArray);
}



  onSearchChange(event){
    this.textoBuscar = event.detail.value;
    
   }
   async calendarioPopover() {
    const popover = await this.popOverCtrl.create({
      component: CalendarioPopoverPage,
      cssClass: 'no-class',
      translucent: true,
      componentProps : {
        fecha:this.date
      }
    });
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', data);
    if(data != undefined ){
      this.date  = new Date(data.fecha)

   if(this.ruta){

    this.cargarDatos();
   }
    }
   
 
      
    
  }

  agregarFacturas(){

let facturas = [];
  for(let i =0; i < this.selectedArray.length; i++){
  facturas.push(this.selectedArray[i].factura)
 
    if (i == this.selectedArray.length-1){

    
      this.modalCtrl.dismiss({
        data:facturas
      })

    }
  }


  }

  
  cargarDatos() {

    let clientes: Clientes[] = []

    this.planificacionEntregasService.syncRutaFacturas(this.ruta.Ruta, format(new Date(this.date),'yyyy-MM-dd')).then(resp => {
      if(resp.length ==0){

        this.alertasService.message('SDE RP', 'No se encontraron faturas para la ruta '+ this.ruta.Descripcion +' selecciona otra fecha')
       // this.cargarListaClientes();
this.clientes = [];
        return;
      }

 
      for (let i = 0; i < resp.length; i++) {


    
        let id = resp[i].CLIENTE_ORIGEN;
        let c = clientes.findIndex(client => client.id == id);


        if (c >= 0) {
          clientes[c].facturas.push(
            {
              factura:resp[i],
              checked:false
            }
          )

        }else{
          let cliente = {
            id: resp[i].CLIENTE_ORIGEN,
            nombre: resp[i].NOMBRE_CLIENTE,
            facturas:  [
              {
                factura:resp[i],
                checked:false
              }
            ],
            checked:false
          }
          clientes.push(cliente)
        }
 

       
if(i ==  resp.length -1){
let data = [];
  for(let c =0; c < clientes.length; c++){
    console.log('clientes[c].facturas.length', clientes[c].facturas.length)
   
if(clientes[c].facturas.length > 0){
  data.push(clientes[c])
 
}
    if(c == clientes.length -1){
      this.clientes = data;

      if(this.clientes.length ==0){

        this.alertasService.message('SDE RP', 'No se encontraron faturas para la ruta '+ this.ruta.Ruta +' selecciona otro cliente')
        this.cargarListaClientes();
      }
      console.log('clientes',clientes)
    }
  }

 
}
      }



    });



  }



}
