import { Component, OnInit, Input } from '@angular/core';
import { ActualizaFacturaGuiasService } from 'src/app/services/actualiza-factura-guias.service';

import { RutaFacturas } from '../../models/rutaFacturas';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-clientes-guias',
  templateUrl: './lista-clientes-guias.page.html',
  styleUrls: ['./lista-clientes-guias.page.scss'],
})
export class ListaClientesGuiasPage implements OnInit {
@Input() facturas:RutaFacturas[]=[];
verdadero = true;
image = '../assets/icons/delivery-truck.svg'
falso = false;
  constructor(
    public actualizaFacturaGuiasService: ActualizaFacturaGuiasService,
    public modalCtrl:ModalController
  ) { }

  ngOnInit() {
  }

  actualizarFactura(factura){
    //this.modalCtrl.dismiss();
    this.actualizaFacturaGuiasService.crearGuia(factura);
  }
  
  eliminarFactura(factura){
    this.modalCtrl.dismiss();
    this.actualizaFacturaGuiasService.eliminarCamionesFacturaIndividual(factura)
  }
}
