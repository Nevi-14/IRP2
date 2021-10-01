import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-clientes',
  templateUrl: './detalle-clientes.page.html',
  styleUrls: ['./detalle-clientes.page.scss'],
})
export class DetalleClientesPage implements OnInit {
  array = Array(4);
  constructor( private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
