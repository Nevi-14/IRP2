import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';

@Component({
  selector: 'app-busqueda-mapa',
  templateUrl: './busqueda-mapa.page.html',
  styleUrls: ['./busqueda-mapa.page.scss'],
})
export class BusquedaMapaPage implements OnInit {
@Input() data;
funcion = 'planificacion-rutas';
filtroToggle = true;
toggleValue = 'id';
longLat = '';
textoBuscar = '';

  constructor(public clientesService: ClientesService, public modalCtrl: ModalController,
    public planificacionRutasService: PlanificacionRutasService) { }

  ngOnInit() {
    console.log(this.data)
this.longLat = '[ ' + this.data.geometry.coordinates + ' ]'
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  seleccionarTodos(){
console.log('todos')
    this.planificacionRutasService.marcadores.forEach(marcador =>{
    console.log(marcador)
      marcador.select = !marcador.select;
    })
  }
  actualizarCordenadas(){

    const marcadoresActualizados = [];
    
 this.planificacionRutasService.marcadores.forEach(marcador =>{

  if(marcador.select){


    const  i =  this.planificacionRutasService.marcadores.findIndex(m => m.id === marcador.id);

if(i >= 0){

  this.planificacionRutasService.marcadores[i].modify = true;
  this.planificacionRutasService.marcadores[i].properties.client.LONGITUD = this.data.geometry.coordinates[0];
  this.planificacionRutasService.marcadores[i].properties.client.LATITUD = this.data.geometry.coordinates[1];
  this.planificacionRutasService.marcadores[i].properties.client.LONGITUD = this.data.geometry.coordinates[0];
  this.planificacionRutasService.marcadores[i].properties.client.LATITUD = this.data.geometry.coordinates[1];
  this.planificacionRutasService.marcadores[i].geometry = { type: 'Feature' , coordinates: [this.data.geometry.coordinates[0],this.data.geometry.coordinates[1]]}
  this.planificacionRutasService.marcadores[i].marker.setLngLat([this.data.geometry.coordinates[0],this.data.geometry.coordinates[1]]);

}
marcadoresActualizados.push(marcador)
  this.modalCtrl.dismiss({
    marcadores:marcadoresActualizados
  });
  }
  marcador.select = false;
 })

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
}
