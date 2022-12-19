import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-planificacion-entrega-cliente-detalle',
  templateUrl: './planificacion-entrega-cliente-detalle.page.html',
  styleUrls: ['./planificacion-entrega-cliente-detalle.page.scss'],
})
export class PlanificacionEntregaClienteDetallePage implements OnInit {
@Input() cliente:any
  constructor(
public modalCtrl: ModalController


) { }

  ngOnInit() {
  }



  cerrarModal(){
this.modalCtrl.dismiss();


  }
}
