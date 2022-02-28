import { Component, OnInit, Input } from '@angular/core';
import { Rutero } from '../../models/Rutero';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-clientes-rutas',
  templateUrl: './clientes-rutas.page.html',
  styleUrls: ['./clientes-rutas.page.scss'],
})
export class ClientesRutasPage implements OnInit {
@Input() cliente:Rutero;
  constructor(
public modalCtrl:ModalController

  ) { }

  ngOnInit() {
    console.log(this.cliente, ' ruterrooooooo')
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
