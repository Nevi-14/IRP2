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
  constructor(public mapaService: MapaService, public clientesService: ClientesService, public modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.data)
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  actualizarCordenadas(id){
    const  i = this.mapaService.marcadores.findIndex(m => m.id === id);

  
    this.mapaService.marcadores[i].cliente.LONGITUD = this.data.geometry.coordinates[0];
    this.mapaService.marcadores[i].cliente.LATITUD = this.data.geometry.coordinates[1];
    this.mapaService.marcadores[i].centro = [this.data.geometry.coordinates[0],this.data.geometry.coordinates[1]]
    this.modalCtrl.dismiss({
      data:  true
     });

  }
}
