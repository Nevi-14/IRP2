import { Component, Input, OnInit } from '@angular/core';
import {  ModalController } from '@ionic/angular';
import { Clientes } from '../../models/clientes';
@Component({
  selector: 'app-detalle-clientes',
  templateUrl: './detalle-clientes.page.html',
  styleUrls: ['./detalle-clientes.page.scss'],
})
export class DetalleClientesPage implements OnInit {
  @Input() detalleCliente: Clientes;

  constructor( public modalCtrl: ModalController) { }

  ngOnInit() {

  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }


}
