import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
interface Marcadores{
  id:string,
  funcion: string,
  cliente:any,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.page.html',
  styleUrls: ['./marcadores.page.scss'],
})

export class MarcadoresPage implements OnInit {
  @Input() marcadores:Marcadores[];
  @Input() duplicados: boolean;
  filtroToggle = true;
  toggleValue = 'id';
@Input() funcion:string;
textoBuscar = '';
  constructor(public clientes: ClientesService, public modalCtrl: ModalController, public planificacionRutasService:PlanificacionRutasService) { }

  ngOnInit() {

  console.log(this.marcadores)
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  cambio(){
    console.log(this.toggleValue,' toggle value')
    if(this.toggleValue === 'id' ){
      this.toggleValue = 'nombre'
      this.filtroToggle = false;
    }else{
      this.toggleValue = 'id'
      this.filtroToggle = true;
    }
 
  }
  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
   }

   irMarcador(item){
 
     this.modalCtrl.dismiss({
      'item': item
    });
   }

   
async detalleClientes(cliente){

  const modal = await this.modalCtrl.create({
    component: DetalleClientesPage,
    cssClass: 'large-modal',
    componentProps:{
      detalleCliente: cliente
    }
  });
  await modal.present();



}
}
