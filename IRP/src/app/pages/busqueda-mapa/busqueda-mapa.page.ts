import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapaService } from 'src/app/services/componentes/mapas/mapa.service';
import { ClientesService } from 'src/app/services/paginas/clientes/clientes.service';

@Component({
  selector: 'app-busqueda-mapa',
  templateUrl: './busqueda-mapa.page.html',
  styleUrls: ['./busqueda-mapa.page.scss'],
})
export class BusquedaMapaPage implements OnInit {
@Input() data: any;
funcion = 'planificacion-rutas';
filtroToggle = true;
toggleValue = 'id';
longLat = '';
textoBuscar = '';

  constructor(public mapaService: MapaService, public clientesService: ClientesService, public modalCtrl: ModalController) { }

  ngOnInit() {
this.longLat = '[ ' + this.data.geometry.coordinates + ' ]'
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  actualizarCordenadas(id){
    
    const  i = this.mapaService.marcadores.findIndex(m => m.id === id);
if(i >= 0){
  console.log(    this.mapaService.marcadores[i], 'before')
  this.mapaService.marcadores[i].modificado = true;
  this.mapaService.marcadores[i].cliente.LONGITUD = this.data.geometry.coordinates[0];
  this.mapaService.marcadores[i].cliente.LATITUD = this.data.geometry.coordinates[1];
  this.mapaService.marcadores[i].centro = [this.data.geometry.coordinates[0],this.data.geometry.coordinates[1]]
  console.log(    this.mapaService.marcadores[i], 'after')
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
