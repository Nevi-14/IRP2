import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';

@Component({
  selector: 'app-calendario-modal',
  templateUrl: './calendario-modal.page.html',
  styleUrls: ['./calendario-modal.page.scss'],
})
export class CalendarioModalPage implements OnInit {
  fecha = new Date().toISOString();
  pickerOptions = {
    mode: 'md'
  };
    dateValue = format(new Date(), 'yyyy-MM-dd') + 'T00:00:00';
  constructor(
public modalCtrl: ModalController

  ) { }

  ngOnInit() {
  }


  dateChanged($event){
    this.dateValue = $event.detail.value;

  
  
    console.log(this.dateValue, 'date value', $event.detail.value)
  }


  retornarFecha(event){

    this.modalCtrl.dismiss({

      fecha: event.detail.value
     });

  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }


}
