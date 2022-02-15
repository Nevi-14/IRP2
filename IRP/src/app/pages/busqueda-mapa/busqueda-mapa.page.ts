import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { MapaService } from 'src/app/services/mapa.service';
import { MapboxGLService } from 'src/app/services/mapbox-gl.service';

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

  constructor(public mapaService: MapaService, public clientesService: ClientesService, public modalCtrl: ModalController, public mapboxGLService: MapboxGLService) { }

  ngOnInit() {
    console.log(this.data)
this.longLat = '[ ' + this.data.geometry.coordinates + ' ]'
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  actualizarCordenadas(id){
    
    const  i = this.mapboxGLService.marcadores.findIndex(m => m.id === id);
    console.log(id, 'actualiza')
if(i >= 0){
  console.log(    this.mapboxGLService.marcadores[i], 'before')
  this.mapboxGLService.marcadores[i].modificado = true;
  this.mapboxGLService.marcadores[i].cliente.LONGITUD = this.data.geometry.coordinates[0];
  this.mapboxGLService.marcadores[i].cliente.LATITUD = this.data.geometry.coordinates[1];
  this.mapboxGLService.marcadores[i].centro = [this.data.geometry.coordinates[0],this.data.geometry.coordinates[1]]
  console.log(    this.mapboxGLService.marcadores[i], 'after')
}
    this.modalCtrl.dismiss({
      data:  true
     });

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
