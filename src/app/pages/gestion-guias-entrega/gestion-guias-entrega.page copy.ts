import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-guias-entrega',
  templateUrl: './gestion-guias-entrega.page.html',
  styleUrls: ['./gestion-guias-entrega.page.scss'],
})
export class GestionGuiasEntregaPage implements OnInit {

  constructor(
public modalCtrl: ModalController



  ) { }

  ngOnInit() {
  }

  cerrarModal(){

this.modalCtrl.dismiss();

  }
}
