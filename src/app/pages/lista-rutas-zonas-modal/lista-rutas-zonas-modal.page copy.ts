import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RutaZonaService } from '../../services/ruta-zona.service';

@Component({
  selector: 'app-lista-rutas-zonas-modal',
  templateUrl: './lista-rutas-zonas-modal.page.html',
  styleUrls: ['./lista-rutas-zonas-modal.page.scss'],
})
export class ListaRutasZonasModalPage implements OnInit {
textoBuscar = '';
  constructor(

    public modalCtrl: ModalController,
    public rutaZonas: RutaZonaService

  ) { }

  ngOnInit() {
    this.rutaZonas.syncRutas();
    console.log(this.rutaZonas.rutasZonasArray, 'array')
  }
  retornarRuta(ev:any){

    console.log(ev.target.value,'ev.target.value')
    this.modalCtrl.dismiss({

      ruta: ev.target.value
     });

  }

  onSearchChange(event){
this.textoBuscar = event.detail.value
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
