import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-planificacion-lista-guias',
  templateUrl: './planificacion-lista-guias.page.html',
  styleUrls: ['./planificacion-lista-guias.page.scss'],
})
export class PlanificacionListaGuiasPage implements OnInit {

  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }
  cerrarModal(){
this.modalCtrl.dismiss();

  }

  onSearchChange($event){


  }
}
