import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-cliente-factura',
  templateUrl: './cliente-factura.page.html',
  styleUrls: ['./cliente-factura.page.scss'],
})
export class ClienteFacturaPage implements OnInit {
@Input() cliente;
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.cliente)
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
