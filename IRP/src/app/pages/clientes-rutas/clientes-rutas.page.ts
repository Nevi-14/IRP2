import { Component, OnInit, Input } from '@angular/core';
import { Rutero } from '../../models/Rutero';
import { ModalController } from '@ionic/angular';
import { ActualizaFacLinService } from 'src/app/services/actualizaFacLin';

@Component({
  selector: 'app-clientes-rutas',
  templateUrl: './clientes-rutas.page.html',
  styleUrls: ['./clientes-rutas.page.scss'],
})
export class ClientesRutasPage implements OnInit {
@Input() cliente:Rutero;
  constructor(
public modalCtrl:ModalController,
public actualizaFacLinService: ActualizaFacLinService

  ) { }

  ngOnInit() {
    this.actualizaFacLinService.syncActualizaFacLin(this.cliente.idGuia);
    console.log(this.cliente, ' ruterrooooooo', this.actualizaFacLinService.facturaLineasEspejoArray,this.actualizaFacLinService.facturaLineasEspejoArray)
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
