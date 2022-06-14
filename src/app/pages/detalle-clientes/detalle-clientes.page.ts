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
longLat = '';
  constructor( public modalCtrl: ModalController) { }

  ngOnInit() {
this.longLat = '[ ' + this.detalleCliente.LONGITUD + ' , ' + this.detalleCliente.LATITUD + ' ]'
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }



}
