import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-clientes-ruta-facturas',
  templateUrl: './lista-clientes-ruta-facturas.page.html',
  styleUrls: ['./lista-clientes-ruta-facturas.page.scss'],
})
export class ListaClientesRutaFacturasPage implements OnInit {
@Input() clientes;
textoBuscar= '';
  constructor(
 public modalCtrl: ModalController

  ) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  retornarFacturaCliente(factura){

    this.modalCtrl.dismiss({

      factura:  factura
     });

  }

  onSearchChange(event){
this.textoBuscar = event.detail.value

  }

}
