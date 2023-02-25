import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  fecha = new Date(format(new Date(), 'MM-dd-yyy')).toISOString();
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }


  cerrarModal() {

    this.modalCtrl.dismiss();
  }


  retornarFecha($event) {
    this.fecha = $event.detail.value;
    this.modalCtrl.dismiss({
      fecha: this.fecha
    });

  }
}
