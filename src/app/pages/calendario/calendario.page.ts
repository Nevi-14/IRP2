import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  fecha = new Date().toISOString();
  constructor(
    public modalCtrl:ModalController
  ) { }

  ngOnInit() {
  }


  cerrarModal(){

    this.modalCtrl.dismiss();
  }

  
  retornarFecha($event){
let fecha = $event.detail.value;
console.log('fecha',fecha)
 
    this.modalCtrl.dismiss({

      fecha:fecha
     });

  }
}
