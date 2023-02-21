import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AlertasService } from '../../services/alertas.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { facturasGuia } from 'src/app/models/facturas';
import { ActualizaFacturaGuia } from 'src/app/models/actualizaFacturaGuia';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { RuteroService } from 'src/app/services/rutero.service';
interface manifiestoModel{
  nombre:string,
  cliente:number,
  facturas:facturasGuia[]

}
@Component({
  selector: 'app-gestion-liquidaciones-facturas',
  templateUrl: './gestion-liquidaciones-facturas.page.html',
  styleUrls: ['./gestion-liquidaciones-facturas.page.scss'],
})
export class GestionLiquidacionesFacturasPage implements OnInit {
@Input() guia:any;
clientes:manifiestoModel[]=[];
textoBuscar = "";
facturas:facturasGuia[]=[]
@Input() fecha:string;
totalFacturasClientes:number=0;
totalFacturas:number=0;
contado:number = 0;
credito:number =0;
montoTotal:number=0;
  constructor(
public modalCtrl:ModalController,
public alertasService:AlertasService,
public facturasService:FacturasService,
public planificacionEntregasService:PlanificacionEntregasService,
public ruteroService:RuteroService

  ) { }

  condicionPago(factura:facturasGuia){
    let condicion = "";
    switch(factura.CONDICION_PAGO){
      case '0':
        condicion = 'Contado'
      break;
      case '1':
      condicion = 'Contado'
      break;
      case '4':
        condicion = 'Contado'
        break;
        default:
          condicion = 'Crédito'
          break;
    }

    return condicion;

  }

  agregarFacturas($event){
 
    let next = $event.detail.checked;
    this.clientes.forEach(resp =>{
      let facturas = resp.facturas;
      facturas.forEach(factura =>{
        let i = this.facturas.findIndex(fact => fact.CLIENTE == factura.CLIENTE);
        factura.SELECCIONADA = next;
        if(next){

          if(i < 0){
            this.facturas.push(factura)
            this.totalFacturas += 1;
            this.montoTotal +=factura.TOTAL_MERCADERIA
            this.contadoMensual(factura, next)
          
          }
     
          return
              }
              if(i >=0){
                console.log('2', i)
                this.facturas.splice(i, 1)
                this.totalFacturas -= 1;
                this.montoTotal -= factura.TOTAL_MERCADERIA
                this.montoTotal =  this.montoTotal < 0 ?  0 :   this.montoTotal 
                this.contadoMensual(factura, next)
            
              }

      })

    })
  }
  agregarFactura($event, factura:facturasGuia){
    console.log('event', $event)
    let next = $event.detail.checked;
    let i = this.facturas.findIndex(fact => fact.CLIENTE == factura.CLIENTE);
    console.log('iii', i)

    if(next){

if(i < 0){
  this.facturas.push(factura)
  this.totalFacturas += 1;
  this.montoTotal +=factura.TOTAL_MERCADERIA
  this.contadoMensual(factura, next)
}

return
    }
    if(i >=0){
      console.log('2', i)
      this.facturas.splice(i, 1)
      this.totalFacturas -= 1;
      this.montoTotal -= factura.TOTAL_MERCADERIA
      this.contadoMensual(factura, next)
  
    }
  }

contadoMensual(factura:facturasGuia, action){
  console.log('factura', factura, 'action', action)
  switch(factura.CONDICION_PAGO){
    case '0':
    action ?    this.contado  += 1 :     this.contado -=1;
    break;
    case '1':
      action ?    this.contado  += 1 :     this.contado -=1;
    break;
    case '4':
      action ?    this.contado  += 1 :     this.contado -=1;;
      break;
      default:
        action ?    this.credito  += 1 :     this.credito -=1;
        break;
  }
}




  ngOnInit() {


/**
 *     this.facturasService.syncGetFacturaToPromise(this.guia.idGuia).then(facturas =>{

      console.log('correct facturas', facturas)
    })
 */
    this.alertasService.presentaLoading('Cargando datos...')
    console.log('this.guia',this.guia)
    //manifiesto returns clients

 
    this.facturasService.syncGetFacturasGuiasToPromise(this.guia.idGuia).then(facturas =>{
      console.log('facturas', facturas)

      if(facturas.length == 0){
        this.alertasService.loadingDissmiss();
      }
      for(let i =0; i <facturas.length; i++){

          let client = this.clientes.findIndex(manifiesto => manifiesto.cliente == facturas[i].CLIENTE);
          
          if(client >=0){
           let f = this.clientes[client].facturas.findIndex(fact => fact.FACTURA == facturas[i].FACTURA);
           if(f >=0){
            this.clientes[client].facturas.push(facturas[i])
  this.totalFacturasClientes += 1;
           }
          }else{
            this.clientes.push({
              nombre:facturas[i].NOMBRE_CLIENTE,
              cliente:facturas[i].CLIENTE,
              facturas:[facturas[i]]
            })
            this.totalFacturasClientes += 1;

          }
        if(i == facturas.length -1){
          console.log(this.clientes);
          console.log('end facturas')
          this.alertasService.loadingDissmiss();
        }
      }
    }, error =>{
      this.alertasService.loadingDissmiss();
    })
  
    
  }

  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  
  }
  liquidarFacturas(){
    if(this.clientes.length != this.totalFacturas){
      this.alertasService.message('IRP','Lo sentimos debes de marcar tocas las facturas para continuar..')
return
    }
    this.alertasService.presentaLoading('Guadando cambios..')
const actualizaFact:ActualizaFacturaGuia[] = [];
    this.clientes.forEach((cliente, index) =>{
      cliente.facturas.forEach(factura =>{
        const actualizarFactura:ActualizaFacturaGuia = {
          numFactura:   factura.FACTURA,
          tipoDocumento: factura.TIPO_DOCUMENTO,
          Fecha:         factura.FECHA,
          despachado:    factura.ESTA_DESPACHADO,
          rubro3:        factura.RUBRO3,
          U_LATITUD:    factura.LATITUD,
          U_LONGITUD:   factura.LONGITUD,
          Fecha_Entrega: factura.FECHA_ENTREGA,
          U_ESTA_LIQUIDADO: 'S',
    
        }
        actualizaFact.push(actualizarFactura) 
     
      })

      if(index ==  this.clientes.length -1){
        console.log('actualizaFact', actualizaFact)
        this.guia.guia.estado = 'FIN'
        this.guia.rutero.estado = 'FIN'

  /**
   *       this.ruteroService.putRuteroToPromise(this.guia.rutero).then(rutero =>{
          console.log('rutero', rutero)
       

        })

   */

        console.log('this.guia', this.guia.guia)
        this.facturasService.insertarFacturas(actualizaFact).then(facturas =>{
          console.log('facturas', facturas)
    
          this.planificacionEntregasService.putGuiaToPromise(this.guia.guia).then(guia =>{
            console.log('guia updated', guia)
            this.alertasService.loadingDissmiss();
            this.alertasService.message('IRP','Liquidación completada.')
            this.modalCtrl.dismiss(true)
          }, error =>{
            this.alertasService.loadingDissmiss();
            this.alertasService.message('IRP','Lo sentimos algo salio mal., verifica que la gui no haya sido liquidada..')
          })
          
        }, error =>{
          this.alertasService.loadingDissmiss();
          this.alertasService.message('IRP','Lo sentimos algo salio mal., verifica que la gui no haya sido liquidada..')
        })
        
      }
    })
   
  }
  cerrarModal(){
this.modalCtrl.dismiss();

  }
}
