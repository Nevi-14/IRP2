import { Component, OnInit } from '@angular/core';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-capacidad-camiones',
  templateUrl: './lista-capacidad-camiones.page.html',
  styleUrls: ['./lista-capacidad-camiones.page.scss'],
})
export class ListaCapacidadCamionesPage implements OnInit {

  constructor(

public camionesService: GestionCamionesService,
public modalCtrl: ModalController

  ) { }

  ngOnInit(

  ) {

    


  }
  cerrarModal(){
this.modalCtrl.dismiss();
  }
}
