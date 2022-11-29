import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RuteroService } from '../../services/rutero.service';
import { Rutero } from '../../models/Rutero';
import { ClientesRutasPage } from '../clientes-rutas/clientes-rutas.page';

@Component({
  selector: 'app-rutero-clientes',
  templateUrl: './rutero-clientes.page.html',
  styleUrls: ['./rutero-clientes.page.scss'],
})
export class RuteroClientesPage implements OnInit {
@Input() ruteroInput:Rutero[]
@Input() guia :any
rutero:Rutero[]=[]
textoBuscar = ''
  constructor(   
    
    public modalCtrl: ModalController,
    public ruteroService: RuteroService
    
    
    ) { }

  ngOnInit(

  ) {
console.log('this.ruteroInput', this.ruteroInput)
    if(this.ruteroInput.length >0 ){
this.ruteroInput.sort((a,b)=>a.orden_Visita - b.orden_Visita)
this.rutero = this.ruteroInput
    }else{
      console.log('this.guia', this.guia)

      this.ruteroService.syncRutero(this.guia.idGuia).then(resp =>{
        resp.sort((a,b)=>a.orden_Visita - b.orden_Visita)
  this.rutero = resp;
 
        console.log('resp', resp)
      })

    }

  }
  cerrarModal(){

    this.modalCtrl.dismiss();
  }
  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  color(estado){
    let color = null;
    switch(estado){
      case 'P':
   color = 'danger'
      break;
   
       case 'I':
        color = 'warning'
   
       break;
       case 'E':
         color = 'success'
         break;
         case 'R':
           color = 'danger'
           break;
     
         default :
         color = 'dark';
    }

    return color;
  }

  estadoSignificado(estado){
    let significado = null;
    switch(estado){
      case 'P':
        significado = 'Pendiente'
      break;
   
       case 'I':
        significado = 'Incompleta'
   
       break;
       case 'E':
        significado = 'Completa'
         break;
         case 'R':
          significado = 'Reprogramada'
           break;
     
         default :
         significado = '';
    }

    return significado;
  }

  onSearchChange(event){
    this.textoBuscar = event.detail.value;

  }
async detalleClientes(cliente:Rutero){
let color = null;
let deliver = 'url(assets/icons/delivery-man.svg)';
let shipped = 'url(assets/icons/shipped.svg)';
let image = null;

  switch(cliente.estado){
    case 'P':
 color = 'primary'
    break;
 
     case 'I':
      color = 'warning'
 
     break;
     case 'E':
       color = 'success'
       break;
       case 'V':
         color = 'danger'
         break;
   
       default :
       color = 'dark';
}''


if(cliente.estado === 'I'){
  image = deliver;
}else if(cliente.estado === 'E'){
  image = shipped;
}else{
 
}

  const modal = await this.modalCtrl.create({
    component: ClientesRutasPage,
    cssClass: 'extra-large-modal',
    componentProps:{
      cliente: cliente,
      color:color,
      imagen: image
    }
  });
  return await modal.present();
}


}
