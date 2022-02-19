import { Component, OnInit, Input } from '@angular/core';


import { RutaFacturas } from '../../models/rutaFacturas';
import { ModalController } from '@ionic/angular';
import { CamionesGuiasService } from 'src/app/services/camiones-guias.service';

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
textoBuscar = '';
  constructor(
    public actualizaFacturaGuiasService: CamionesGuiasService,
    public modalCtrl:ModalController
  ) { }

  ngOnInit() {
  }

  actualizarFactura(factura){
    this.modalCtrl.dismiss();
    this.actualizaFacturaGuiasService.crearGuia(factura);
  }
  
  eliminarCamionesFacturaIndividualAlert(factura){
    this.actualizaFacturaGuiasService.eliminarCamionesFacturaIndividualAlert(factura)
    this.modalCtrl.dismiss();
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }
}
